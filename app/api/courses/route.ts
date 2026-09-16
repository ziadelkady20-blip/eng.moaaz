import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

export async function GET(){
 const user=await getCurrentUser()
 const courses=await db.course.findMany({
   where:{published:true},
   include:{grade:true,subject:true,teacher:{include:{user:true}},modules:{include:{lessons:true},orderBy:{order:'asc'}}},
   orderBy:{createdAt:'desc'}
 })
 const student=user?.student
 const enrolled=student?await db.courseEnrollment.findMany({where:{studentId:student.id},select:{courseId:true}}):[]
 const ids=new Set(enrolled.map(x=>x.courseId))
 return NextResponse.json({courses:courses.map(c=>({id:c.id,title:c.title,description:c.description,price:c.price,grade:c.grade.name,subject:c.subject.name,teacher:c.teacher.user.name,lessons:c.modules.reduce((n,m)=>n+m.lessons.length,0),enrolled:ids.has(c.id)}))})
}
