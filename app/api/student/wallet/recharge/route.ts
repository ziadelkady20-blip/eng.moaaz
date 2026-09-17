import { NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { db } from '@/lib/db'
import { requireRole } from '@/lib/auth'
import { ensureWallet } from '@/lib/wallet'
import { randomUUID } from 'crypto'

const MAX_PROOF_BYTES=2*1024*1024
const methods=new Set(['INSTAPAY','VODAFONE_CASH','ETISALAT_CASH','ORANGE_CASH','BANK_TRANSFER','OTHER'])

export async function POST(req:Request){
  try{
    const user=await requireRole(['STUDENT'])
    if(!user.student) return NextResponse.json({error:'غير مصرح'},{status:401})
    const form=await req.formData()
    const amount=Number(form.get('amount'))
    const method=String(form.get('method')||'')
    const senderPhone=String(form.get('senderPhone')||'').trim()
    const proof=form.get('proof')
    if(!Number.isFinite(amount)||amount<=0||amount>100000) return NextResponse.json({error:'قيمة الشحن غير صحيحة'},{status:400})
    if(!methods.has(method)) return NextResponse.json({error:'طريقة الدفع غير صحيحة'},{status:400})
    if(!/^01\d{9}$/.test(senderPhone)) return NextResponse.json({error:'رقم الهاتف المحول منه مطلوب ويجب أن يكون صحيحًا'},{status:400})
    if(!(proof instanceof File)) return NextResponse.json({error:'ارفع صورة إثبات التحويل'},{status:400})
    if(!proof.type.startsWith('image/')) return NextResponse.json({error:'إثبات التحويل يجب أن يكون صورة'},{status:400})
    if(proof.size>MAX_PROOF_BYTES) return NextResponse.json({error:'حجم الصورة يجب ألا يتجاوز 2MB'},{status:400})
    const bytes=Buffer.from(await proof.arrayBuffer())
    const proofData=`data:${proof.type};base64,${bytes.toString('base64')}`
    const walletId=await ensureWallet(user.student.id)
    const id=randomUUID()
    await db.$executeRaw(Prisma.sql`INSERT INTO "RechargeRequest" ("id","walletId","amount","method","senderPhone","proofData","proofMime") VALUES (${id},${walletId},${amount},${method},${senderPhone},${proofData},${proof.type})`)
    return NextResponse.json({id,status:'PENDING',message:'تم إرسال طلب الشحن للمراجعة.'},{status:201})
  }catch(e){ console.error('RECHARGE_CREATE_ERROR',e); return NextResponse.json({error:'تعذر إرسال طلب الشحن'},{status:500}) }
}
