import {NextResponse} from 'next/server'
import {db} from '@/lib/db'
import {requireRole} from '@/lib/auth'

export async function DELETE(_:Request,{params}:{params:Promise<{id:string}>}){
  try{
    await requireRole(['ADMIN'])
    const {id}=await params
    const course=await db.course.findUnique({where:{id},include:{modules:{include:{lessons:{select:{id:true,videoId:true}}}}}})
    if(!course)return NextResponse.json({error:'الكورس غير موجود'},{status:404})
    const lessonIds=course.modules.flatMap(m=>m.lessons.map(l=>l.id))
    const videoIds=course.modules.flatMap(m=>m.lessons.map(l=>l.videoId).filter(Boolean) as string[])
    await db.$transaction(async tx=>{
      if(lessonIds.length) await tx.lesson.updateMany({where:{id:{in:lessonIds}},data:{videoId:null}})
      if(videoIds.length) await tx.video.deleteMany({where:{id:{in:videoIds}}})
      await tx.assignment.deleteMany({where:{courseId:id}})
      await tx.course.delete({where:{id}})
    })
    return NextResponse.json({ok:true})
  }catch(e){
    console.error('ADMIN_COURSE_DELETE_ERROR',e)
    return NextResponse.json({error:'تعذر حذف الكورس. تأكد أنه لا توجد بيانات مرتبطة تمنع الحذف.'},{status:400})
  }
}
