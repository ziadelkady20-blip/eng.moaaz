import {NextResponse} from 'next/server'
import {db} from '@/lib/db'
import {requireRole} from '@/lib/auth'

export async function GET(){
  try{
    const user=await requireRole(['STUDENT'])
    if(!user.student)return NextResponse.json({error:'الحساب غير مكتمل'},{status:400})

    const enrollments=await db.courseEnrollment.findMany({
      where:{studentId:user.student.id},
      include:{course:{include:{subject:true,modules:{orderBy:{order:'asc'},include:{lessons:{orderBy:{order:'asc'},include:{video:true}}}}}}},
      orderBy:{enrolledAt:'desc'},
    })
    const progress=await db.studentProgress.findMany({where:{studentId:user.student.id}})
    const progressByLesson=new Map(progress.map(p=>[p.lessonId,p]))

    const lessons=enrollments.flatMap(e=>e.course.modules.flatMap(m=>m.lessons.map(l=>{
      const p=progressByLesson.get(l.id)
      const watchedPct=Math.round(p?.watchedPct??0)
      const status=p?.completed?'مكتمل':watchedPct>0?'قيد التقدم':l.video?.isPublished===false?'مغلق':'متاح'
      return {id:l.id,title:l.title,course:e.course.title,subject:e.course.subject.name,order:l.order,module:m.title,durationSec:l.video?.durationSec??0,watchedPct,lastPositionSec:p?.lastPositionSec??0,completed:Boolean(p?.completed),status,videoAvailable:Boolean(l.video?.isPublished && (l.video?.youtubeUrl||l.video?.providerAssetId))}
    })))

    return NextResponse.json({lessons})
  }catch{
    return NextResponse.json({error:'غير مصرح'},{status:401})
  }
}
