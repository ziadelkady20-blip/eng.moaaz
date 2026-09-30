import {NextResponse} from 'next/server'
import {db} from '@/lib/db'
import {requireRole} from '@/lib/auth'

export async function GET(){
  try{
    const user=await requireRole(['STUDENT'])
    if(!user.student)return NextResponse.json({error:'الحساب غير مكتمل'},{status:400})

    const [enrollments, progress]=await Promise.all([
      db.courseEnrollment.findMany({
        where:{studentId:user.student.id},
        include:{course:{include:{subject:true,modules:{orderBy:{order:'asc'},include:{lessons:{orderBy:{order:'asc'},include:{video:true}}}}}}},
        orderBy:{enrolledAt:'desc'},
      }),
      db.studentProgress.findMany({where:{studentId:user.student.id}}),
    ])

    const progressByLesson=new Map(progress.map(p=>[p.lessonId,p]))
    const map=new Map<string,any>()
    const addLesson=(l:any,course:any,m:any)=>{
      const p=progressByLesson.get(l.id)
      const watchedPct=Math.round(p?.watchedPct??0)
      map.set(l.id,{id:l.id,title:l.title,course:course.title,subject:course.subject.name,order:l.order,module:m.title,durationSec:l.video?.durationSec??0,watchedPct,lastPositionSec:p?.lastPositionSec??0,completed:Boolean(p?.completed),status:p?.completed?'مكتمل':watchedPct>0?'قيد التقدم':l.video?.isPublished===false?'مغلق':'متاح',videoAvailable:Boolean(l.video?.isPublished && (l.video?.youtubeUrl||l.video?.providerAssetId))})
    }

    for(const enrollment of enrollments) {
      for(const module of enrollment.course.modules) {
        for(const lesson of module.lessons) addLesson(lesson,enrollment.course,module)
      }
    }

    return NextResponse.json({lessons:Array.from(map.values())},{headers:{'Cache-Control':'private, no-store, max-age=0'}})
  }catch(error){
    console.error('STUDENT_LESSONS_GET_ERROR',error)
    return NextResponse.json({error:'تعذر تحميل الدروس حاليًا'},{status:500})
  }
}
