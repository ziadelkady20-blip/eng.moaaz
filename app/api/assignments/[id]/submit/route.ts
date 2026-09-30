import { NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { requireRole } from '@/lib/auth'
import { db } from '@/lib/db'

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireRole(['STUDENT'])
    if (!user.student) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    const { id } = await params
    const assignment = await db.assignment.findUnique({
      where: { id },
      include: { lesson: { include: { module: true } } },
    })
    if (!assignment || !assignment.courseId || !assignment.lesson) {
      return NextResponse.json({ error: 'الواجب غير موجود أو غير متاح' }, { status: 404 })
    }

    const enrolled = await db.courseEnrollment.findUnique({
      where: { studentId_courseId: { studentId: user.student.id, courseId: assignment.courseId } },
    })
    const purchase = await db.$queryRaw<any[]>(Prisma.sql`SELECT "id" FROM "ContentPurchase" WHERE "studentId"=${user.student.id} AND "courseId"=${assignment.courseId} LIMIT 1`)
    if (!enrolled && !purchase.length) return NextResponse.json({ error: 'الواجب غير متاح لحسابك' }, { status: 403 })

    const modules = await db.courseModule.findMany({
      where: { courseId: assignment.courseId },
      orderBy: { order: 'asc' },
      include: { lessons: { orderBy: { order: 'asc' }, include: { assignments: { select: { id: true } } } } },
    })
    const lessons = modules.flatMap((m) => m.lessons)
    const index = lessons.findIndex((l) => l.id === assignment.lessonId)
    if (index > 0) {
      const previous = lessons[index - 1]
      const ids = previous.assignments.map((a) => a.id)
      if (ids.length) {
        const solved = await db.assignmentSubmission.count({
          where: { studentId: user.student.id, assignmentId: { in: ids }, submittedAt: { not: null } },
        })
        if (solved < ids.length) return NextResponse.json({ error: 'لازم تفتح الدرس السابق وتحل واجبه أولًا.' }, { status: 403 })
      }
    }

    const body = await req.json() as { fileUrl?: string }
    const fileUrl = (body.fileUrl || '').trim()
    if (!fileUrl) return NextResponse.json({ error: 'ارفع ملف الحل PDF أولًا' }, { status: 400 })

    const stored = await db.uploadedFile.findFirst({
      where: { url: fileUrl, ownerId: user.id, mimeType: 'application/pdf' },
    })
    if (!stored) return NextResponse.json({ error: 'ملف الحل غير صالح أو لم يكتمل رفعه' }, { status: 400 })

    const submission = await db.assignmentSubmission.upsert({
      where: { assignmentId_studentId: { assignmentId: id, studentId: user.student.id } },
      create: { assignmentId: id, studentId: user.student.id, fileUrl, submittedAt: new Date() },
      update: { fileUrl, submittedAt: new Date() },
    })
    return NextResponse.json({ submission })
  } catch (e) {
    console.error('ASSIGNMENT_SUBMIT_ERROR', e)
    return NextResponse.json({ error: 'تعذر تسليم الواجب' }, { status: 400 })
  }
}
