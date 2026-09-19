import {NextResponse} from 'next/server'
import {Prisma} from '@prisma/client'
import {db} from '@/lib/db'
import {requireRole} from '@/lib/auth'

export async function GET(){
  try{
    const u=await requireRole(['STUDENT'])
    if(!u.student)return NextResponse.json({error:'غير مصرح'},{status:401})
    const [enrollments,purchases]=await Promise.all([
      db.courseEnrollment.findMany({where:{studentId:u.student.id},select:{courseId:true}}),
      db.$queryRaw<any[]>(Prisma.sql`SELECT "courseId" FROM "ContentPurchase" WHERE "studentId"=${u.student.id}`),
    ])
    const courseIds=[...new Set([...enrollments.map((x)=>x.courseId),...purchases.map((x)=>x.courseId)])]
    if(!courseIds.length)return NextResponse.json({assignments:[]})
    const assignments=await db.assignment.findMany({
      where:{courseId:{in:courseIds}},
      orderBy:{dueAt:'asc'},
      include:{
        course:true,
        lesson:{include:{module:true}},
        submissions:{where:{studentId:u.student.id}},
      },
    })
    return NextResponse.json({
      assignments:assignments.map((a)=>({
        id:a.id,
        title:a.title,
        description:a.description,
        dueAt:a.dueAt,
        course:a.course,
        lesson:a.lesson?{id:a.lesson.id,title:a.lesson.title,module:a.lesson.module.title}:null,
        submissions:a.submissions,
      })),
    })
  }catch{
    return NextResponse.json({error:'تعذر تحميل الواجبات'},{status:400})
  }
}
