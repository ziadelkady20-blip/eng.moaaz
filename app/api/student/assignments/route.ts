import {NextResponse} from 'next/server'
import {db} from '@/lib/db'
import {requireRole} from '@/lib/auth'

export async function GET(){
  try{
    const u=await requireRole(['STUDENT'])
    if(!u.student)return NextResponse.json({error:'غير مصرح'},{status:401})
    const assignments=await db.assignment.findMany({
      where:{course:{enrollments:{some:{studentId:u.student.id}}}},
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
