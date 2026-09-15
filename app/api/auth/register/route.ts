import { NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'
import { z } from 'zod'
import { db } from '@/lib/db'
import { hashPassword, setSession } from '@/lib/auth'
import { Role, StudyType } from '@prisma/client'

const schema = z.object({
  name:z.string().min(3), phone:z.string().regex(/^01\d{9}$/), password:z.string().min(8),
  gradeId:z.string().optional(), governorateId:z.string().optional(), schoolId:z.string().optional(),
  studyType:z.enum(['ONLINE','CENTER','HYBRID']).default('ONLINE'), guardianPhone:z.string().optional()
})
export async function POST(req:Request){
  const ip=req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()||'unknown'; const rl=rateLimit(`register:${ip}`,5,60_000); if(!rl.ok) return NextResponse.json({error:'محاولات كثيرة. حاول بعد دقيقة.'},{status:429,headers:{'Retry-After':'60'}})
  try {
    const body=schema.parse(await req.json())
    const exists=await db.user.findUnique({where:{phone:body.phone}})
    if(exists) return NextResponse.json({error:'رقم الهاتف مسجل بالفعل'}, {status:409})
    const grade = body.gradeId ? await db.grade.findUnique({where:{name:body.gradeId}}) : null
    const gov = body.governorateId ? await db.governorate.findUnique({where:{name:body.governorateId}}) : null
    let schoolId = body.schoolId
    if (body.schoolId) { const school = await db.school.findFirst({where:{name:body.schoolId}}); schoolId = school?.id }
    const user=await db.user.create({data:{name:body.name,phone:body.phone,passwordHash:hashPassword(body.password),role:Role.STUDENT,student:{create:{gradeId:grade?.id,governorateId:gov?.id,schoolId,studyType:StudyType[body.studyType],guardianPhone:body.guardianPhone}}},include:{student:true}})
    await setSession(user.id,user.role)
    return NextResponse.json({user:{id:user.id,name:user.name,role:user.role,student:user.student}})
  } catch(e){ return NextResponse.json({error:e instanceof z.ZodError?'بيانات التسجيل غير صحيحة':'تعذر إنشاء الحساب'}, {status:400}) }
}
