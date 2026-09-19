import {NextResponse} from 'next/server'
import {db} from '@/lib/db'
import {getCurrentUser} from '@/lib/auth'
import {z} from 'zod'

const option=z.object({text:z.string().trim().min(1).max(500),isCorrect:z.boolean()})
const question=z.object({text:z.string().trim().min(1).max(2000),type:z.enum(['MCQ','WRITTEN']).default('MCQ'),points:z.coerce.number().int().min(1).max(100),options:z.array(option).max(6)}).superRefine((q,ctx)=>{
  if(q.type==='MCQ' && q.options.length<2)ctx.addIssue({code:'custom',message:'يجب إضافة اختيارين على الأقل'})
  if(q.type==='MCQ' && q.options.filter(o=>o.isCorrect).length!==1)ctx.addIssue({code:'custom',message:'يجب تحديد إجابة صحيحة واحدة'})
})
const schema=z.object({title:z.string().trim().min(2).max(200),durationMin:z.coerce.number().int().min(1).max(300).optional(),courseId:z.string().min(1),questions:z.array(question).min(1).max(100)})

export async function GET(){
  const u=await getCurrentUser();if(!u?.teacher)return NextResponse.json({error:'UNAUTHORIZED'},{status:401})
  return NextResponse.json(await db.exam.findMany({where:{course:{teacherId:u.teacher.id}},include:{course:true,questions:{include:{options:true},orderBy:{id:'asc'}}},orderBy:{id:'desc'}}))
}

export async function POST(req:Request){
  try{
    const u=await getCurrentUser();if(!u?.teacher)return NextResponse.json({error:'غير مصرح'},{status:401})
    const data=schema.parse(await req.json())
    const course=await db.course.findFirst({where:{id:data.courseId,teacherId:u.teacher.id},select:{id:true}})
    if(!course)return NextResponse.json({error:'الكورس غير تابع لك'},{status:403})
    const exam=await db.exam.create({data:{
      title:data.title,durationMin:data.durationMin??null,courseId:data.courseId,
      questions:{create:data.questions.map(q=>({text:q.text,type:q.type,points:q.points,options:{create:q.options}}))}
    },include:{questions:{include:{options:true}}}})
    return NextResponse.json({exam},{status:201})
  }catch(e){return NextResponse.json({error:e instanceof z.ZodError?(e.issues[0]?.message||'بيانات الامتحان غير صحيحة'):'تعذر إنشاء الامتحان'},{status:400})}
}
