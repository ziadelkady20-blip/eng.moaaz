import {NextResponse} from 'next/server'
import {db} from '@/lib/db'
import {requireRole} from '@/lib/auth'
import {z} from 'zod'

const schema=z.object({moduleId:z.string().min(1),title:z.string().trim().min(2).max(200)})

export async function POST(req:Request){
  try{
    await requireRole(['ADMIN'])
    const data=schema.parse(await req.json())
    const module=await db.courseModule.findUnique({where:{id:data.moduleId},select:{id:true}})
    if(!module)return NextResponse.json({error:'الوحدة غير موجودة'},{status:404})
    const last=await db.lesson.findFirst({where:{moduleId:data.moduleId},orderBy:{order:'desc'},select:{order:true}})
    const lesson=await db.lesson.create({data:{moduleId:data.moduleId,title:data.title,order:(last?.order??0)+1}})
    return NextResponse.json({lesson},{status:201})
  }catch(e){
    return NextResponse.json({error:e instanceof z.ZodError?'بيانات الدرس غير مكتملة':'تعذر إنشاء الدرس'},{status:400})
  }
}
