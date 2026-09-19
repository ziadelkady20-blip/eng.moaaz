import {NextResponse} from 'next/server'
import {db} from '@/lib/db'
import {getCurrentUser} from '@/lib/auth'
import {z} from 'zod'

const schema=z.object({lessonId:z.string().min(1).optional(),title:z.string().trim().min(2).max(200).optional(),description:z.string().trim().max(5000).optional(),dueAt:z.coerce.date().optional()})

export async function PATCH(req:Request,{params}:{params:Promise<{id:string}>}){
  try{
    const u=await getCurrentUser();if(!u?.teacher)return NextResponse.json({error:'غير مصرح'},{status:401})
    const {id}=await params
    const existing=await db.assignment.findUnique({where:{id},include:{course:{select:{teacherId:true}}}})
    if(!existing||existing.course?.teacherId!==u.teacher.id)return NextResponse.json({error:'الواجب غير موجود'},{status:404})
    const data=schema.parse(await req.json());const updateData:any={}
    if(data.title!==undefined)updateData.title=data.title
    if(data.description!==undefined)updateData.description=data.description||null
    if(data.dueAt!==undefined)updateData.dueAt=data.dueAt
    if(data.lessonId!==undefined){
      const lesson=await db.lesson.findUnique({where:{id:data.lessonId},include:{module:{select:{courseId:true,course:{select:{teacherId:true}}}}}})
      if(!lesson||lesson.module.course.teacherId!==u.teacher.id)return NextResponse.json({error:'الدرس غير تابع لك'},{status:403})
      updateData.lessonId=lesson.id;updateData.courseId=lesson.module.courseId
    }
    return NextResponse.json({assignment:await db.assignment.update({where:{id},data:updateData})})
  }catch(e){return NextResponse.json({error:'تعذر تعديل الواجب'},{status:400})}
}

export async function DELETE(_:Request,{params}:{params:Promise<{id:string}>}){
  try{
    const u=await getCurrentUser();if(!u?.teacher)return NextResponse.json({error:'غير مصرح'},{status:401})
    const {id}=await params
    const existing=await db.assignment.findUnique({where:{id},include:{course:{select:{teacherId:true}}}})
    if(!existing||existing.course?.teacherId!==u.teacher.id)return NextResponse.json({error:'الواجب غير موجود'},{status:404})
    await db.assignment.delete({where:{id}})
    return NextResponse.json({ok:true})
  }catch{return NextResponse.json({error:'تعذر حذف الواجب'},{status:400})}
}
