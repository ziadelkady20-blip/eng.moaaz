import {NextResponse} from 'next/server'
import {db} from '@/lib/db'
import {requireRole} from '@/lib/auth'
import {z} from 'zod'

const schema=z.object({
  lessonId:z.string().min(1).optional(),
  title:z.string().trim().min(2).max(200).optional(),
  description:z.string().trim().max(5000).optional(),
  dueAt:z.coerce.date().optional(),
})

export async function PATCH(req:Request,{params}:{params:Promise<{id:string}>}){
  try{
    await requireRole(['ADMIN'])
    const {id}=await params
    const body=await req.json()
    const data=schema.parse(body)
    const existing=await db.assignment.findUnique({where:{id}})
    if(!existing)return NextResponse.json({error:'الواجب غير موجود'},{status:404})
    const updateData:any={}
    if(data.title!==undefined)updateData.title=data.title
    if(data.description!==undefined)updateData.description=data.description||null
    if(data.dueAt!==undefined)updateData.dueAt=data.dueAt
    if(data.lessonId!==undefined){
      const lesson=await db.lesson.findUnique({where:{id:data.lessonId},include:{module:{select:{courseId:true}}}})
      if(!lesson)return NextResponse.json({error:'الدرس غير موجود'},{status:404})
      updateData.lessonId=lesson.id
      updateData.courseId=lesson.module.courseId
    }
    const assignment=await db.assignment.update({where:{id},data:updateData})
    return NextResponse.json({assignment})
  }catch(e){
    return NextResponse.json({error:e instanceof z.ZodError?'بيانات التعديل غير صحيحة':'تعذر تعديل الواجب'},{status:400})
  }
}

export async function DELETE(_:Request,{params}:{params:Promise<{id:string}>}){
  try{
    await requireRole(['ADMIN'])
    const {id}=await params
    const existing=await db.assignment.findUnique({where:{id},select:{id:true}})
    if(!existing)return NextResponse.json({error:'الواجب غير موجود'},{status:404})
    await db.assignment.delete({where:{id}})
    return NextResponse.json({ok:true})
  }catch(e){
    return NextResponse.json({error:'تعذر حذف الواجب'},{status:400})
  }
}
