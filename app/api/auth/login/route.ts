import { NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'
import { z } from 'zod'
import { db } from '@/lib/db'
import { setSession, verifyPassword } from '@/lib/auth'
const schema=z.object({phone:z.string().min(8),password:z.string().min(1)})
export async function POST(req:Request){
 const ip=req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()||'unknown'; const rl=rateLimit(`login:${ip}`,10,60_000); if(!rl.ok) return NextResponse.json({error:'محاولات كثيرة. حاول بعد دقيقة.'},{status:429,headers:{'Retry-After':'60'}})
 try{const {phone,password}=schema.parse(await req.json()); const user=await db.user.findUnique({where:{phone}}); if(!user||!verifyPassword(password,user.passwordHash)) return NextResponse.json({error:'رقم الهاتف أو كلمة المرور غير صحيحة'},{status:401}); await setSession(user.id,user.role); return NextResponse.json({user:{id:user.id,name:user.name,role:user.role}})}catch{return NextResponse.json({error:'بيانات الدخول غير صحيحة'},{status:400})}
}
