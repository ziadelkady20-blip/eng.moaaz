import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

export async function GET(){
  try{
    const user=await getCurrentUser()
    const courses=await db.course.findMany({
      where:{published:true},
      include:{grade:true,subject:true,teacher:{include:{user:true}},modules:{include:{lessons:true},orderBy:{order:'asc'}}},
      orderBy:{createdAt:'desc'}
    })
    const student=user?.student
    const [enrolled,progress]=student?await Promise.all([
      db.courseEnrollment.findMany({where:{studentId:student.id},select:{courseId:true}}),
      db.studentProgress.findMany({where:{studentId:student.id},select:{lessonId:true,watchedPct:true,completed:true}}),
    ]):[[],[]]
    const enrolledIds=new Set(enrolled.map(x=>x.courseId))
    const progressByLesson=new Map(progress.map(x=>[x.lessonId,x]))
    return NextResponse.json({courses:courses.map(c=>{
      const lessonIds=c.modules.flatMap(m=>m.lessons.map(l=>l.id))
      const ps=lessonIds.map(id=>progressByLesson.get(id)).filter(Boolean) as Array<{watchedPct:number;completed:boolean}>
      const progressPct=lessonIds.length?Math.round(ps.reduce((sum,p)=>sum+p.watchedPct,0)/lessonIds.length):0
      const completedLessons=ps.filter(p=>p.completed).length
      return {id:c.id,title:c.title,description:c.description,price:c.price,grade:c.grade.name,subject:c.subject.name,teacher:c.teacher.user.name,lessons:lessonIds.length,enrolled:enrolledIds.has(c.id),progress:progressPct,completedLessons}
    })})
  }catch(e){
    console.error('COURSES_GET_ERROR',e)
    return NextResponse.json({error:'تعذر تحميل الكورسات'},{status:500})
  }
}
