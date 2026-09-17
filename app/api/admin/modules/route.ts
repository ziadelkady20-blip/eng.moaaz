import {NextResponse} from 'next/server'
import {db} from '@/lib/db'
import {requireRole} from '@/lib/auth'
import {z} from 'zod'

const schema=z.object({courseId:z.string().min(1),title:z.string().trim().min(2).max(200)})

export async function POST(req:Request){
  try{
    await requireRole(['ADMIN'])
    const data=schema.parse(await req.json())
    const course=await db.course.findUnique({where:{id:data.courseId},select:{id:true}})
    if(!course)return NextResponse.json({error:'الكورس غير موجود'},{status:404})
    const last=await db.courseModule.findFirst({where:{courseId:data.courseId},orderBy:{order:'desc'},select:{order:true}})
    const module=await db.courseModule.create({data:{courseId:data.courseId,title:data.title,order:(last?.order??0)+1}})
    return NextResponse.json({module},{status:201})
  }catch(e){
    return NextResponse.json({error:e instanceof z.ZodError?'بيانات الوحدة غير مكتملة':'تعذر إنشاء الوحدة'},{status:400})
  }
}
