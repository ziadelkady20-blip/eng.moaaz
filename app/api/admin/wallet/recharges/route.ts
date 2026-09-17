import { NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { db } from '@/lib/db'
import { requireAdminAccess } from '@/lib/admin-access'
import { money } from '@/lib/wallet'

export async function GET(){
  try{
    await requireAdminAccess()
    const rows=await db.$queryRaw<any[]>(Prisma.sql`SELECT r."id",r."amount",r."method",r."senderPhone",r."reference",r."status",r."proofMime",r."reviewNote",r."createdAt",r."reviewedAt",u."name" AS "studentName",u."phone" AS "studentPhone",s."id" AS "studentId",g."name" AS "gradeName" FROM "RechargeRequest" r JOIN "Wallet" w ON w."id"=r."walletId" JOIN "Student" s ON s."id"=w."studentId" JOIN "User" u ON u."id"=s."userId" LEFT JOIN "Grade" g ON g."id"=s."gradeId" ORDER BY CASE WHEN r."status"='PENDING' THEN 0 ELSE 1 END,r."createdAt" DESC LIMIT 200`)
    return NextResponse.json({requests:rows.map(r=>({...r,amount:money(r.amount)}))})
  }catch(e){ console.error('ADMIN_RECHARGES_GET_ERROR',e); return NextResponse.json({error:'غير مصرح'},{status:401}) }
}
