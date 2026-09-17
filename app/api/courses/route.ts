import { NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { db } from '@/lib/db'
import { requireRole } from '@/lib/auth'

export async function GET(){
  try{
    const user=await requireRole(['STUDENT'])
    if(!user.student) return NextResponse.json({error:'الحساب غير مرتبط ببيانات طالب'},{status:401})

    // Always read the student's current grade from the database.
    // Never fall back to showing all courses when gradeId is missing.
    const studentRows=await db.$queryRaw<any[]>(Prisma.sql`
      SELECT "id","gradeId"
      FROM "Student"
      WHERE "userId"=${user.id}
      LIMIT 1
    `)
    const student=studentRows[0]
    if(!student) return NextResponse.json({error:'بيانات الطالب غير موجودة'},{status:404})
    if(!student.gradeId) return NextResponse.json({courses:[],gradeId:null,gradeName:null})

    const courses=await db.course.findMany({
      where:{published:true,gradeId:student.gradeId},
      include:{grade:true,subject:true,teacher:{include:{user:true}},modules:{include:{lessons:true},orderBy:{order:'asc'}}},
      orderBy:{createdAt:'desc'}
    })
    const [enrolled,progress,purchases]=await Promise.all([
      db.courseEnrollment.findMany({where:{studentId:student.id},select:{courseId:true}}),
      db.studentProgress.findMany({where:{studentId:student.id},select:{lessonId:true,watchedPct:true,completed:true}}),
      db.$queryRaw<any[]>(Prisma.sql`SELECT "courseId" FROM "ContentPurchase" WHERE "studentId"=${student.id}`),
    ])
    const enrolledIds=new Set(enrolled.map(x=>x.courseId)); purchases.forEach(x=>enrolledIds.add(x.courseId))
    const progressByLesson=new Map(progress.map(x=>[x.lessonId,x]))
    const grade=await db.grade.findUnique({where:{id:student.gradeId},select:{id:true,name:true}})
    return NextResponse.json({
      gradeId:student.gradeId,
      gradeName:grade?.name??null,
      courses:courses.map(c=>{
        const lessonIds=c.modules.flatMap(m=>m.lessons.map(l=>l.id))
        const ps=lessonIds.map(id=>progressByLesson.get(id)).filter(Boolean) as Array<{watchedPct:number;completed:boolean}>
        const progressPct=lessonIds.length?Math.round(ps.reduce((sum,p)=>sum+p.watchedPct,0)/lessonIds.length):0
        const completedLessons=ps.filter(p=>p.completed).length
        return {id:c.id,title:c.title,description:c.description,price:Number(c.price),grade:c.grade.name,subject:c.subject.name,teacher:c.teacher.user.name,lessons:lessonIds.length,enrolled:enrolledIds.has(c.id),progress:progressPct,completedLessons}
      })
    })
  }catch(e){ console.error('COURSES_GET_ERROR',e); return NextResponse.json({error:'تعذر تحميل الكورسات'},{status:500}) }
}
