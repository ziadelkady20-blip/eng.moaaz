import {NextResponse} from 'next/server'
import {db} from '@/lib/db'
import {getCurrentUser} from '@/lib/auth'

export async function DELETE(_:Request,{params}:{params:Promise<{id:string}>}){
  try{
    const u=await getCurrentUser();if(!u?.teacher)return NextResponse.json({error:'غير مصرح'},{status:401})
    const {id}=await params
    const exam=await db.exam.findUnique({where:{id},include:{course:{select:{teacherId:true}}}})
    if(!exam||exam.course?.teacherId!==u.teacher.id)return NextResponse.json({error:'الامتحان غير موجود'},{status:404})
    await db.exam.delete({where:{id}})
    return NextResponse.json({ok:true})
  }catch{return NextResponse.json({error:'تعذر حذف الامتحان'},{status:400})}
}
