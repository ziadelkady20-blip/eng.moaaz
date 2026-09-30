import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireRole } from '@/lib/auth'
import { z } from 'zod'

const FILE_MARKER = '\n\n[ASSIGNMENT_PDF_URL]:'

const schema = z.object({
  lessonId: z.string().min(1).optional(),
  title: z.string().trim().min(2).max(200).optional(),
  description: z.string().trim().max(5000).optional(),
  dueAt: z.coerce.date().optional(),
  fileUrl: z.string().url().optional().or(z.literal('')),
})

function packDescription(description?: string | null, fileUrl?: string | null) {
  const clean = (description || '').split(FILE_MARKER)[0].trim()
  return fileUrl ? `${clean}${FILE_MARKER}${fileUrl}` : (clean || null)
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const actor = await requireRole(['ADMIN'])
    const { id } = await params
    const data = schema.parse(await req.json())
    const existing = await db.assignment.findUnique({ where: { id } })
    if (!existing) return NextResponse.json({ error: 'الواجب غير موجود' }, { status: 404 })

    const updateData: any = {}
    if (data.title !== undefined) updateData.title = data.title
    if (data.dueAt !== undefined) updateData.dueAt = data.dueAt

    if (data.description !== undefined || data.fileUrl !== undefined) {
      const old = existing.description || ''
      const oldIndex = old.indexOf(FILE_MARKER)
      const oldDescription = oldIndex === -1 ? old : old.slice(0, oldIndex).trim()
      const oldFileUrl = oldIndex === -1 ? null : old.slice(oldIndex + FILE_MARKER.length).trim() || null
      const nextDescription = data.description !== undefined ? data.description : oldDescription
      const nextFileUrl = data.fileUrl !== undefined ? (data.fileUrl || null) : oldFileUrl

      if (nextFileUrl) {
        const file = await db.uploadedFile.findFirst({ where: { url: nextFileUrl, ownerId: actor.id, mimeType: 'application/pdf' } })
        if (!file && nextFileUrl !== oldFileUrl) return NextResponse.json({ error: 'ملف الواجب غير صالح' }, { status: 400 })
      }
      updateData.description = packDescription(nextDescription, nextFileUrl)
    }

    if (data.lessonId !== undefined) {
      const lesson = await db.lesson.findUnique({ where: { id: data.lessonId }, include: { module: { select: { courseId: true } } } })
      if (!lesson) return NextResponse.json({ error: 'الدرس غير موجود' }, { status: 404 })
      updateData.lessonId = lesson.id
      updateData.courseId = lesson.module.courseId
    }

    const assignment = await db.assignment.update({ where: { id }, data: updateData })
    return NextResponse.json({ assignment })
  } catch (e) {
    return NextResponse.json({ error: e instanceof z.ZodError ? 'بيانات التعديل غير صحيحة' : 'تعذر تعديل الواجب' }, { status: 400 })
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireRole(['ADMIN'])
    const { id } = await params
    const existing = await db.assignment.findUnique({ where: { id }, select: { id: true } })
    if (!existing) return NextResponse.json({ error: 'الواجب غير موجود' }, { status: 404 })
    await db.assignment.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'تعذر حذف الواجب' }, { status: 400 })
  }
}
