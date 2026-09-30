import {NextResponse} from 'next/server'
import {db} from '@/lib/db'
import {requireRole} from '@/lib/auth'

export async function GET(){
  try{
    const user=await requireRole(['STUDENT'])
    if(!user.student)return NextResponse.json({error:'الحساب غير مكتمل'},{status:400})

    const [enrollments, directRows, progress]=await Promise.all([
      db.courseEnrollment.findMany({
        where:{studentId:user.student.id},
        include:{course:{include:{subject:true,modules:{orderBy:{order:'asc'},include:{lessons:{orderBy:{order:'asc'},include:{video:true}}}}}}},
        orderBy:{enrolledAt:'desc'},
      }),
      db.$queryRaw<{lessonId:string}[]>`SELECT "lessonId" FROM "StudentLessonAccess" WHERE "studentId"=${user.student.id}`,
      db.studentProgress.findMany({where:{studentId:user.student.id}}),
    ])
    const progressByLesson=new Map(progress.map(p=>[p.lessonId,p]))
    const directIds=new Set(directRows.map(row=>row.lessonId))
    const directLessons=directIds.size
      ? await db.lesson.findMany({where:{id:{in:Array.from(directIds)}},include:{module:{include:{course:{include:{subject:true}}}},video:true},orderBy:{order:'asc'}})
      : []

    const map=new Map<string,any>()
    const addLesson=(l:any,course:any,m:any,direct=false)=>{
      const p=progressByLesson.get(l.id)
      const watchedPct=Math.round(p?.watchedPct??0)
      map.set(l.id,{id:l.id,title:l.title,course:course.title,subject:course.subject.name,order:l.order,module:m.title,durationSec:l.video?.durationSec??0,watchedPct,lastPositionSec:p?.lastPositionSec??0,completed:Boolean(p?.completed),status:p?.completed?'مكتمل':watchedPct>0?'قيد التقدم':l.video?.isPublished===false?'مغلق':'متاح',videoAvailable:Boolean(l.video?.isPublished && (l.video?.youtubeUrl||l.video?.providerAssetId)),directAccess:direct})
    }
    for(const enrollment of enrollments) for(const module of enrollment.course.modules) for(const lesson of module.lessons) addLesson(lesson,enrollment.course,module,false)
    for(const lesson of directLessons) addLesson(lesson,lesson.module.course,lesson.module,true)

    return NextResponse.json({lessons:Array.from(map.values())})
  }catch{
    return NextResponse.json({error:'غير مصرح'},{status:401})
  }
}
