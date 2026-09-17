import { NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { db } from '@/lib/db'
import { requireAdminAccess } from '@/lib/admin-access'
import { money } from '@/lib/wallet'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function readRequests() {
  // Start from RechargeRequest itself. The request must remain visible to the
  // admin even if an optional student/grade relation is missing or inconsistent.
  const rows = await db.$queryRaw<any[]>(Prisma.sql`
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
    LEFT JOIN "Wallet" w ON w."id" = r."walletId"
    LEFT JOIN "Student" s ON s."id" = w."studentId"
    LEFT JOIN "User" u ON u."id" = s."userId"
    LEFT JOIN "Grade" g ON g."id" = s."gradeId"
    ORDER BY CASE WHEN r."status" = 'PENDING' THEN 0 ELSE 1 END, r."createdAt" DESC
    LIMIT 200
  `)

  return rows.map(r => ({
    ...r,
    amount: money(r.amount),
    createdAt: new Date(r.createdAt).toISOString(),
    reviewedAt: r.reviewedAt ? new Date(r.reviewedAt).toISOString() : null,
  }))
}

export async function GET() {
  try {
    await requireAdminAccess()
    const requests = await readRequests()
    return NextResponse.json(
      { requests },
      { headers: { 'Cache-Control': 'no-store, max-age=0, must-revalidate' } },
    )
  } catch (error) {
    console.error('ADMIN_RECHARGES_GET_ERROR', error)
    return NextResponse.json(
      { error: 'تعذر تحميل طلبات الشحن' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } },
    )
  }
}
