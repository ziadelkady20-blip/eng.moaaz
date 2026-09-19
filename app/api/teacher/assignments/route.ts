import {NextResponse} from 'next/server'
import {db} from '@/lib/db'
import {getCurrentUser} from '@/lib/auth'
import {z} from 'zod'

const schema=z.object({
  lessonId:z.string().min(1),
  title:z.string().trim().min(2).max(200),
  description:z.string().trim().max(5000).optional(),
  dueAt:z.coerce.date(),
})

export async function GET(){
  const u=await getCurrentUser()
  if(!u?.teacher)return NextResponse.json({error:'UNAUTHORIZED'},{status:401})
  return NextResponse.json(await db.assignment.findMany({
    where:{course:{teacherId:u.teacher.id}},
    include:{course:true,lesson:{include:{module:true}},submissions:{include:{student:{include:{user:true}}}}},
    orderBy:{dueAt:'asc'},
  }))
}

export async function POST(req:Request){
  try{
    const u=await getCurrentUser()
    if(!u?.teacher)return NextResponse.json({error:'غير مصرح'},{status:401})
    const data=schema.parse(await req.json())
    const lesson=await db.lesson.findUnique({where:{id:data.lessonId},include:{module:{select:{courseId:true,course:{select:{teacherId:true}}}}}})
    if(!lesson || lesson.module.course.teacherId!==u.teacher.id)return NextResponse.json({error:'الدرس غير تابع لأحد كورساتك'},{status:403})
    const assignment=await db.assignment.create({data:{title:data.title,description:data.description||null,dueAt:data.dueAt,lessonId:lesson.id,courseId:lesson.module.courseId}})
    return NextResponse.json({assignment},{status:201})
  }catch(e){
    return NextResponse.json({error:e instanceof z.ZodError?'بيانات الواجب غير مكتملة':'تعذر إضافة الواجب'},{status:400})
  }
}
