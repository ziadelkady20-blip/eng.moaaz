import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireRole } from '@/lib/auth'
import { z } from 'zod'

const FILE_MARKER = '\n\n[ASSIGNMENT_PDF_URL]:'

const schema = z.object({
  lessonId: z.string().min(1),
  title: z.string().trim().min(2).max(200),
  description: z.string().trim().max(5000).optional(),
  dueAt: z.coerce.date(),
  fileUrl: z.string().url().optional().or(z.literal('')),
})

function packDescription(description?: string | null, fileUrl?: string | null) {
  const clean = (description || '').split(FILE_MARKER)[0].trim()
  return fileUrl ? `${clean}${FILE_MARKER}${fileUrl}` : (clean || null)
}

function unpackDescription(description?: string | null) {
  const raw = description || ''
  const index = raw.indexOf(FILE_MARKER)
  if (index === -1) return { description: raw, fileUrl: null as string | null }
  return { description: raw.slice(0, index).trim(), fileUrl: raw.slice(index + FILE_MARKER.length).trim() || null }
}

async function ownedPdf(userId: string, fileUrl?: string) {
  if (!fileUrl) return null
  const file = await db.uploadedFile.findFirst({ where: { url: fileUrl, ownerId: userId } })
  if (!file || file.mimeType !== 'application/pdf') throw new Error('ملف الواجب غير صالح')
  return file
}

export async function GET() {
  try {
    await requireRole(['ADMIN'])
    const assignments = await db.assignment.findMany({
      orderBy: { dueAt: 'asc' },
      include: {
        course: { select: { id: true, title: true } },
        lesson: { include: { module: { select: { id: true, title: true } } } },
        submissions: {
          orderBy: { submittedAt: 'desc' },
          include: { student: { include: { user: { select: { id: true, name: true, phone: true } } } } },
        },
      },
    })
    return NextResponse.json({
      assignments: assignments.map((a) => ({
        ...a,
        ...unpackDescription(a.description),
      })),
    })
  } catch {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
  }
}

export async function POST(req: Request) {
  try {
    const actor = await requireRole(['ADMIN'])
    const data = schema.parse(await req.json())
    const lesson = await db.lesson.findUnique({ where: { id: data.lessonId }, include: { module: { select: { courseId: true } } } })
    if (!lesson) return NextResponse.json({ error: 'الدرس غير موجود' }, { status: 404 })
    await ownedPdf(actor.id, data.fileUrl)

    const assignment = await db.assignment.create({
      data: {
        title: data.title,
        description: packDescription(data.description, data.fileUrl),
        dueAt: data.dueAt,
        lessonId: data.lessonId,
        courseId: lesson.module.courseId,
      },
    })
    return NextResponse.json({ assignment: { ...assignment, ...unpackDescription(assignment.description) } }, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: e instanceof z.ZodError ? 'بيانات الواجب غير مكتملة' : 'تعذر إضافة الواجب' }, { status: 400 })
  }
}
