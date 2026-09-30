import { NextResponse } from 'next/server'
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
      where: {
        studentId_courseId: {
          studentId: user.student.id,
          courseId: assignment.courseId,
        },
      },
    })
    if (!enrolled) return NextResponse.json({ error: 'الواجب غير متاح لحسابك' }, { status: 403 })

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
