import { NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { db } from '@/lib/db'
import { requireAdminAccess } from '@/lib/admin-access'

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdminAccess()
    const { id } = await params
    const rows = await db.$queryRaw<any[]>(
      Prisma.sql`SELECT "proofData","proofMime" FROM "RechargeRequest" WHERE "id"=${id} LIMIT 1`
    )
    if (!rows[0]?.proofData) {
      return NextResponse.json({ error: 'الإثبات غير موجود' }, { status: 404 })
    }

    const data = String(rows[0].proofData)
    const match = data.match(/^data:[^;]+;base64,([\s\S]+)$/)
    if (!match) {
      return NextResponse.json({ error: 'ملف إثبات غير صالح' }, { status: 500 })
    }

    return new NextResponse(Buffer.from(match[1], 'base64'), {
      status: 200,
      headers: {
        'Content-Type': rows[0].proofMime || 'image/jpeg',
        'Cache-Control': 'private, no-store',
      },
    })
  } catch (e) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
  }
}
