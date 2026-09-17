import {NextResponse} from 'next/server'
import {db} from '@/lib/db'
import {requireRole} from '@/lib/auth'

export async function DELETE(_:Request,{params}:{params:Promise<{id:string}>}){
  try{
    await requireRole(['ADMIN'])
    const {id}=await params
    const lesson=await db.lesson.findUnique({where:{id},select:{id:true,videoId:true}})
    if(!lesson)return NextResponse.json({error:'الدرس غير موجود'},{status:404})
    await db.$transaction(async tx=>{
      if(lesson.videoId){await tx.lesson.update({where:{id},data:{videoId:null}});await tx.video.delete({where:{id:lesson.videoId}})}
      await tx.lesson.delete({where:{id}})
    })
    return NextResponse.json({ok:true})
  }catch(e){console.error('ADMIN_LESSON_DELETE_ERROR',e);return NextResponse.json({error:'تعذر حذف الدرس'},{status:400})}
}
