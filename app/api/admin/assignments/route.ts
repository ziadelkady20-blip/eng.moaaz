import {NextResponse} from 'next/server'
import {db} from '@/lib/db'
import {requireRole} from '@/lib/auth'
import {z} from 'zod'

const schema=z.object({
  lessonId:z.string().min(1),
  title:z.string().trim().min(2).max(200),
  description:z.string().trim().max(5000).optional(),
  dueAt:z.coerce.date(),
})

export async function POST(req:Request){
  try{
    await requireRole(['ADMIN'])
    const data=schema.parse(await req.json())
    const lesson=await db.lesson.findUnique({where:{id:data.lessonId},include:{module:{select:{courseId:true}}}})
    if(!lesson)return NextResponse.json({error:'الدرس غير موجود'},{status:404})
    const assignment=await db.assignment.create({
      data:{
        title:data.title,
        description:data.description||null,
        dueAt:data.dueAt,
        lessonId:data.lessonId,
        courseId:lesson.module.courseId,
      },
    })
    return NextResponse.json({assignment},{status:201})
  }catch(e){
    return NextResponse.json({error:e instanceof z.ZodError?'بيانات الواجب غير مكتملة':'تعذر إضافة الواجب'},{status:400})
  }
}
