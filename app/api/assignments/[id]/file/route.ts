import { NextResponse } from 'next/server'
import { get } from '@vercel/blob'
import { Prisma } from '@prisma/client'
import { db } from '@/lib/db'
import { requireRole } from '@/lib/auth'

const FILE_MARKER = '\n\n[ASSIGNMENT_PDF_URL]:'

function extractFileUrl(description?: string | null) {
  const raw = description || ''
  const index = raw.indexOf(FILE_MARKER)
  return index === -1 ? null : raw.slice(index + FILE_MARKER.length).trim() || null
}

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireRole(['ADMIN', 'STUDENT'])
    const { id } = await params
    const assignment = await db.assignment.findUnique({ where: { id } })
    const fileUrl = extractFileUrl(assignment?.description)
    if (!assignment || !fileUrl) return NextResponse.json({ error: 'ملف الواجب غير موجود' }, { status: 404 })

    if (user.role === 'STUDENT') {
      if (!user.student || !assignment.courseId) return NextResponse.json({ error: 'غير متاح' }, { status: 403 })
      const enrolled = await db.courseEnrollment.findUnique({
        where: { studentId_courseId: { studentId: user.student.id, courseId: assignment.courseId } },
      })
      const purchase = await db.$queryRaw<any[]>(Prisma.sql`SELECT "id" FROM "ContentPurchase" WHERE "studentId"=${user.student.id} AND "courseId"=${assignment.courseId} LIMIT 1`)
      if (!enrolled && !purchase.length) return NextResponse.json({ error: 'الواجب غير متاح لحسابك' }, { status: 403 })
    }

    const stored = await db.uploadedFile.findFirst({ where: { url: fileUrl, mimeType: 'application/pdf' } })
    if (!stored) return NextResponse.json({ error: 'ملف الواجب غير موجود' }, { status: 404 })

    const result = await get(stored.storageKey, { access: 'private', useCache: false })
    if (!result) return NextResponse.json({ error: 'تعذر قراءة ملف الواجب' }, { status: 404 })

    return new NextResponse(result.stream, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="assignment.pdf"',
        'Cache-Control': 'private, no-store',
      },
    })
  } catch (error) {
    console.error('ASSIGNMENT_FILE_ERROR', error)
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
  }
}
