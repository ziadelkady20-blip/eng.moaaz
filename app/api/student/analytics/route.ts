import {NextResponse} from 'next/server'
import {db} from '@/lib/db'
import {requireRole} from '@/lib/auth'

export async function GET(){
  try{
    const user=await requireRole(['STUDENT'])
    if(!user.student)return NextResponse.json({error:'الحساب غير مكتمل'},{status:400})
    const studentId=user.student.id
    const since=new Date(Date.now()-30*24*60*60*1000)
    const [grades,attempts,progress,attendance]=await Promise.all([
      db.studentGrade.findMany({where:{studentId},orderBy:{recordedAt:'asc'},take:50,include:{subject:true}}),
      db.examAttempt.findMany({where:{studentId,submittedAt:{gte:since,not:null}},orderBy:{submittedAt:'asc'},include:{exam:true}}),
      db.studentProgress.findMany({where:{studentId}}),
      db.attendance.findMany({where:{studentId,date:{gte:since}}}),
    ])
    const series=[...grades.map(g=>({date:g.recordedAt,value:Math.round((g.score/g.maxScore)*100)})),...attempts.filter(a=>a.submittedAt).map(a=>({date:a.submittedAt as Date,value:Math.round(a.score??0)}))].sort((a,b)=>a.date.getTime()-b.date.getTime()).slice(-12)
    const average=grades.length?Math.round(grades.reduce((s,g)=>s+(g.score/g.maxScore)*100,0)/grades.length):0
    const attendancePct=attendance.length?Math.round(attendance.filter(a=>a.status==='PRESENT'||a.status==='ONLINE').length/attendance.length*100):0
    const completed=progress.filter(p=>p.completed).length
    const watched=progress.length?Math.round(progress.reduce((s,p)=>s+p.watchedPct,0)/progress.length):0
    return NextResponse.json({average,attendancePct,completedLessons:completed,watchedPct:watched,series,gradeCount:grades.length,examCount:attempts.length})
  }catch(e){
    console.error('STUDENT_ANALYTICS_ERROR',e)
    return NextResponse.json({error:'تعذر تحميل تقرير الأداء'},{status:500})
  }
}
