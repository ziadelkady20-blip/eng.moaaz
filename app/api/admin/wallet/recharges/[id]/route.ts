import { NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { db } from '@/lib/db'
import { requireAdminAccess } from '@/lib/admin-access'
import { money } from '@/lib/wallet'
import { randomUUID } from 'crypto'

export async function POST(req:Request,{params}:{params:Promise<{id:string}>}){
  try{
    const admin=await requireAdminAccess()
    const {id}=await params
    const body=await req.json().catch(()=>null)
    const action=body?.action
    const note=typeof body?.note==='string'?body.note.trim().slice(0,500):null
    if(action!=='APPROVE'&&action!=='REJECT') return NextResponse.json({error:'إجراء غير صحيح'},{status:400})
    const result=await db.$transaction(async tx=>{
      const rows=await tx.$queryRaw<any[]>(Prisma.sql`SELECT r."id",r."walletId",r."amount",r."status",w."balance" FROM "RechargeRequest" r JOIN "Wallet" w ON w."id"=r."walletId" WHERE r."id"=${id} FOR UPDATE`)
      const r=rows[0]
      if(!r) throw new Error('طلب الشحن غير موجود')
      if(r.status!=='PENDING') throw new Error('تمت مراجعة هذا الطلب بالفعل')
      if(action==='REJECT'){
        await tx.$executeRaw(Prisma.sql`UPDATE "RechargeRequest" SET "status"='REJECTED',"reviewedById"=${admin.id},"reviewedAt"=CURRENT_TIMESTAMP,"reviewNote"=${note} ,"updatedAt"=CURRENT_TIMESTAMP WHERE "id"=${id}`)
        return {status:'REJECTED',balance:money(r.balance)}
      }
      const amount=money(r.amount), balance=money(r.balance), newBalance=money(balance+amount), txId=randomUUID(), reference=`recharge_${id}`
      await tx.$executeRaw(Prisma.sql`UPDATE "Wallet" SET "balance"=${newBalance},"updatedAt"=CURRENT_TIMESTAMP WHERE "id"=${r.walletId}`)
      await tx.$executeRaw(Prisma.sql`INSERT INTO "WalletTransaction" ("id","walletId","type","amount","balanceAfter","description","reference") VALUES (${txId},${r.walletId},'RECHARGE',${amount},${newBalance},'شحن محفظة بعد مراجعة التحويل',${reference})`)
      await tx.$executeRaw(Prisma.sql`UPDATE "RechargeRequest" SET "status"='APPROVED',"reviewedById"=${admin.id},"reviewedAt"=CURRENT_TIMESTAMP,"reviewNote"=${note},"updatedAt"=CURRENT_TIMESTAMP WHERE "id"=${id}`)
      return {status:'APPROVED',balance:newBalance}
    })
    return NextResponse.json({success:true,...result})
  }catch(e){ const message=e instanceof Error?e.message:'تعذر مراجعة الطلب'; return NextResponse.json({error:message},{status:400}) }
}
