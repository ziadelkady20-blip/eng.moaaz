import { Prisma } from '@prisma/client'
import AdminShell from '@/components/AdminShell'
import AdminWalletClient from './AdminWalletClient'
import { requireAdminAccess } from '@/lib/admin-access'
import { db } from '@/lib/db'
import { money } from '@/lib/wallet'

async function getRechargeRequests(){
 await requireAdminAccess()
 const rows=await db.$queryRaw<any[]>(Prisma.sql`SELECT r."id",r."amount",r."method",r."senderPhone",r."status",r."proofMime",r."reviewNote",r."createdAt",r."reviewedAt",u."name" AS "studentName",u."phone" AS "studentPhone",s."id" AS "studentId",g."name" AS "gradeName" FROM "RechargeRequest" r JOIN "Wallet" w ON w."id"=r."walletId" JOIN "Student" s ON s."id"=w."studentId" JOIN "User" u ON u."id"=s."userId" LEFT JOIN "Grade" g ON g."id"=s."gradeId" ORDER BY CASE WHEN r."status"='PENDING' THEN 0 ELSE 1 END,r."createdAt" DESC LIMIT 200`)
 return rows.map(r=>({...r,amount:money(r.amount),createdAt:new Date(r.createdAt).toISOString(),reviewedAt:r.reviewedAt?new Date(r.reviewedAt).toISOString():null}))
}

export default async function AdminWallet(){
 const rows=await getRechargeRequests()
 return <AdminShell><AdminWalletClient initialRows={rows}/></AdminShell>
}
