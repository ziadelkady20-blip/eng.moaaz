import {NextResponse} from 'next/server'
import {Prisma} from '@prisma/client'
import {db} from '@/lib/db'
import {getCurrentUser} from '@/lib/auth'

export async function GET(_:Request,{params}:{params:Promise<{id:string}>}){
  const user=await getCurrentUser()
  if(!user?.student)return NextResponse.json({error:'غير مصرح'},{status:401})

  const {id}=await params
  const lesson=await db.lesson.findUnique({
    where:{id},
    include:{
      module:{include:{course:true}},
      video:true,
      resources:true,
      assignments:{orderBy:{dueAt:'asc'}},
    },
  })
  if(!lesson)return NextResponse.json({error:'الدرس غير موجود'},{status:404})

  if(!user.student.gradeId || lesson.module.course.gradeId!==user.student.gradeId){
    return NextResponse.json({error:'هذا الدرس غير متاح لصفك'},{status:403})
  }

  const access=await db.courseEnrollment.findUnique({
    where:{studentId_courseId:{studentId:user.student.id,courseId:lesson.module.courseId}},
  })
  const purchase=await db.$queryRaw<any[]>(Prisma.sql`SELECT "id" FROM "ContentPurchase" WHERE "studentId"=${user.student.id} AND "courseId"=${lesson.module.courseId} LIMIT 1`)
  if(!access&&!purchase.length){
    return NextResponse.json({error:'هذا المحتوى غير متاح لحسابك. يجب شراء الكورس من المحفظة أولًا.'},{status:403})
  }

  const orderedLessons=await db.lesson.findMany({
    where:{module:{courseId:lesson.module.courseId}},
    orderBy:[{module:{order:'asc'}},{order:'asc'}],
    include:{assignments:{select:{id:true}}},
  })
  const index=orderedLessons.findIndex((l)=>l.id===lesson.id)
  if(index>0){
    const previous=orderedLessons[index-1]
    const previousAssignmentIds=previous.assignments.map((a)=>a.id)
    if(previousAssignmentIds.length){
      const solved=await db.assignmentSubmission.count({
        where:{
          studentId:user.student.id,
          assignmentId:{in:previousAssignmentIds},
          submittedAt:{not:null},
        },
      })
      if(solved<previousAssignmentIds.length){
        return NextResponse.json({error:'لازم تحل واجب الدرس السابق قبل فتح هذا الدرس.'},{status:403})
      }
    }
  }

  const [progress,submissions]=await Promise.all([
    db.studentProgress.findUnique({where:{studentId_lessonId:{studentId:user.student.id,lessonId:id}}}),
    lesson.assignments.length
      ? db.assignmentSubmission.findMany({
          where:{studentId:user.student.id,assignmentId:{in:lesson.assignments.map((a)=>a.id)}},
          select:{assignmentId:true,submittedAt:true,score:true,feedback:true,fileUrl:true},
        })
      : Promise.resolve([]),
  ])
  const submissionMap=new Map(submissions.map((s)=>[s.assignmentId,s]))
  const providerAssetId=lesson.video?.isPublished?lesson.video.providerAssetId:null

  return NextResponse.json(
    {
      lesson:{
        id:lesson.id,
        title:lesson.title,
        course:lesson.module.course.title,
        video:providerAssetId?{provider:lesson.video?.provider||'YOUTUBE',id:providerAssetId}:null,
        resources:lesson.resources,
        assignments:lesson.assignments.map((a)=>({
          id:a.id,
          title:a.title,
          description:a.description,
          dueAt:a.dueAt,
          submission:submissionMap.get(a.id)||null,
        })),
        progress:progress??{watchedPct:0,lastPositionSec:0,completed:false},
      },
      viewer:{name:user.name,phone:user.phone},
    },
    {headers:{'Cache-Control':'private, no-store, max-age=0','X-Content-Type-Options':'nosniff'}},
  )
}
