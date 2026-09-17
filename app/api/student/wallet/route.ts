import { NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { db } from '@/lib/db'
import { requireRole } from '@/lib/auth'
import { ensureWallet, money } from '@/lib/wallet'

export async function GET(){
  try{
    const user=await requireRole(['STUDENT'])
    if(!user.student) return NextResponse.json({error:'غير مصرح'},{status:401})
    const walletId=await ensureWallet(user.student.id)
    const [wallet,transactions,recharges]=await Promise.all([
      db.$queryRaw<any[]>(Prisma.sql`SELECT "id","balance","updatedAt" FROM "Wallet" WHERE "id"=${walletId} LIMIT 1`),
      db.$queryRaw<any[]>(Prisma.sql`SELECT "id","type","amount","balanceAfter","description","reference","createdAt" FROM "WalletTransaction" WHERE "walletId"=${walletId} ORDER BY "createdAt" DESC LIMIT 50`),
      db.$queryRaw<any[]>(Prisma.sql`SELECT "id","amount","method","senderPhone","reference","status","reviewNote","createdAt","reviewedAt" FROM "RechargeRequest" WHERE "walletId"=${walletId} ORDER BY "createdAt" DESC LIMIT 20`)
    ])
    return NextResponse.json({balance:money(wallet[0]?.balance||0),transactions:transactions.map(t=>({...t,amount:money(t.amount),balanceAfter:money(t.balanceAfter)})),recharges:recharges.map(r=>({...r,amount:money(r.amount)}))})
  }catch(e){ console.error('WALLET_GET_ERROR',e); return NextResponse.json({error:'تعذر تحميل المحفظة'},{status:500}) }
}
