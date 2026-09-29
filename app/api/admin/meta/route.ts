import {NextResponse} from 'next/server'
import {db} from '@/lib/db'
import {requireRole} from '@/lib/auth'

const ALLOWED_GRADES=['الصف الأول الثانوي','الصف الثاني الثانوي']

export async function GET(){
 try{
  await requireRole(['ADMIN'])
  const [grades,subjects,teachers,lessons]=await Promise.all([
   db.grade.findMany({where:{name:{in:ALLOWED_GRADES}},orderBy:{name:'asc'}}),
   db.subject.findMany({orderBy:{name:'asc'}}),
   db.teacher.findMany({include:{user:true}}),
   db.lesson.findMany({include:{module:{include:{course:true}},video:true},orderBy:{title:'asc'}})
  ])
  return NextResponse.json({grades,subjects,teachers,lessons})
 }catch{return NextResponse.json({error:'غير مصرح'},{status:401})}
}
