import {NextResponse} from 'next/server'
import {db} from '@/lib/db'
import {requireRole} from '@/lib/auth'

export async function DELETE(_:Request,{params}:{params:Promise<{id:string}>}){
  try{
    await requireRole(['ADMIN'])
    const {id}=await params
    const module=await db.courseModule.findUnique({where:{id},include:{lessons:{select:{id:true,videoId:true}}}})
    if(!module)return NextResponse.json({error:'الوحدة غير موجودة'},{status:404})
    const lessonIds=module.lessons.map(l=>l.id)
    const videoIds=module.lessons.map(l=>l.videoId).filter(Boolean) as string[]
    await db.$transaction(async tx=>{
      if(lessonIds.length) await tx.lesson.updateMany({where:{id:{in:lessonIds}},data:{videoId:null}})
      if(videoIds.length) await tx.video.deleteMany({where:{id:{in:videoIds}}})
      if(lessonIds.length) await tx.assignment.deleteMany({where:{lessonId:{in:lessonIds}}})
      await tx.courseModule.delete({where:{id}})
    })
    return NextResponse.json({ok:true})
  }catch(e){console.error('ADMIN_MODULE_DELETE_ERROR',e);return NextResponse.json({error:'تعذر حذف الوحدة'},{status:400})}
}

export async function PATCH(req:Request,{params}:{params:Promise<{id:string}>}){try{await requireRole(['ADMIN']);const {id}=await params;const body=await req.json();const title=typeof body?.title==='string'?body.title.trim():'';if(!title)return NextResponse.json({error:'اسم الوحدة مطلوب'},{status:400});const module=await db.courseModule.update({where:{id},data:{title}});return NextResponse.json({module})}catch(e){return NextResponse.json({error:'تعذر تعديل الوحدة'},{status:400})}}
