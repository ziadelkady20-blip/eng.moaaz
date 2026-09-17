import { Prisma } from '@prisma/client'
import AdminShell from '@/components/AdminShell'
import AdminWalletClient from './AdminWalletClient'
import { requireAdminAccess } from '@/lib/admin-access'
import { db } from '@/lib/db'
import { money } from '@/lib/wallet'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getRechargeRequests(){
  await requireAdminAccess()
  const rows=await db.$queryRaw<any[]>(Prisma.sql`
    SELECT
      r."id",
      r."walletId",
      r."amount",
      r."method",
      r."senderPhone",
      r."status",
      r."proofMime",
      r."reviewNote",
      r."createdAt",
      r."reviewedAt",
      COALESCE(u."name", 'طالب') AS "studentName",
      COALESCE(u."phone", '') AS "studentPhone",
      s."id" AS "studentId",
      g."name" AS "gradeName"
    FROM "RechargeRequest" r
    LEFT JOIN "Wallet" w ON w."id"=r."walletId"
    LEFT JOIN "Student" s ON s."id"=w."studentId"
    LEFT JOIN "User" u ON u."id"=s."userId"
    LEFT JOIN "Grade" g ON g."id"=s."gradeId"
    ORDER BY CASE WHEN r."status"='PENDING' THEN 0 ELSE 1 END,r."createdAt" DESC
    LIMIT 200
  `)
  return rows.map(r=>({...r,amount:money(r.amount),createdAt:new Date(r.createdAt).toISOString(),reviewedAt:r.reviewedAt?new Date(r.reviewedAt).toISOString():null}))
}

export default async function AdminWallet(){
  const rows=await getRechargeRequests()
  return <AdminShell><AdminWalletClient initialRows={rows}/></AdminShell>
}
