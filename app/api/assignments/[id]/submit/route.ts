import {NextResponse} from 'next/server'
import {requireRole} from '@/lib/auth'
import {db} from '@/lib/db'

export async function POST(req:Request,{params}:{params:Promise<{id:string}>}){
  try{
    const user=await requireRole(['STUDENT'])
    if(!user.student)return NextResponse.json({error:'غير مصرح'},{status:401})
    const {id}=await params
    const assignment=await db.assignment.findUnique({
      where:{id},
      include:{lesson:{include:{module:true}}},
    })
    if(!assignment || !assignment.courseId || !assignment.lesson){
      return NextResponse.json({error:'الواجب غير موجود أو غير متاح'},{status:404})
    }

    const enrolled=await db.courseEnrollment.findUnique({
      where:{studentId_courseId:{studentId:user.student.id,courseId:assignment.courseId}},
    })
    if(!enrolled)return NextResponse.json({error:'الواجب غير متاح لحسابك'},{status:403})

    const modules=await db.courseModule.findMany({
      where:{courseId:assignment.courseId},
      orderBy:{order:'asc'},
      include:{lessons:{orderBy:{order:'asc'},include:{assignments:{select:{id:true}}}}},
    })
    const lessons=modules.flatMap((m)=>m.lessons)
    const index=lessons.findIndex((l)=>l.id===assignment.lessonId)
    if(index>0){
      const previous=lessons[index-1]
      const ids=previous.assignments.map((a)=>a.id)
      if(ids.length){
        const solved=await db.assignmentSubmission.count({
          where:{studentId:user.student.id,assignmentId:{in:ids},submittedAt:{not:null}},
        })
        if(solved<ids.length)return NextResponse.json({error:'لازم تفتح الدرس السابق وتحل واجبه أولًا.'},{status:403})
      }
    }

    const ct=req.headers.get('content-type')||''
    let fileUrl=''
    if(ct.includes('application/json')){
      const body=await req.json() as {fileUrl?:string}
      fileUrl=(body.fileUrl||'').trim()
    }else if(ct.includes('multipart/form-data')){
      const fd=await req.formData()
      fileUrl=String(fd.get('fileUrl')||'').trim()
    }

    const submission=await db.assignmentSubmission.upsert({
      where:{assignmentId_studentId:{assignmentId:id,studentId:user.student.id}},
      create:{assignmentId:id,studentId:user.student.id,fileUrl,submittedAt:new Date()},
      update:{fileUrl,submittedAt:new Date()},
    })
    return NextResponse.json({submission})
  }catch(e){
    console.error('ASSIGNMENT_SUBMIT_ERROR',e)
    return NextResponse.json({error:'تعذر تسليم الواجب'},{status:400})
  }
}
