import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAdminAccess } from '@/lib/admin-access'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'

const bodySchema = z.object({ lessonId: z.string(), action: z.enum(['add', 'remove']) })

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdminAccess()
    const { id } = await params
    const student = await db.student.findUnique({ where: { userId: id }, select: { id: true } })
    if (!student) return NextResponse.json({ error: 'هذا الحساب ليس حساب طالب' }, { status: 400 })

    const [lessons, assigned] = await Promise.all([
      db.lesson.findMany({
        orderBy: [{ module: { course: { title: 'asc' } } }, { module: { order: 'asc' } }, { order: 'asc' }],
        select: { id: true, title: true, order: true, module: { select: { title: true, order: true, course: { select: { id: true, title: true, grade: { select: { name: true } } } } } }, video: { select: { isPublished: true, youtubeUrl: true, providerAssetId: true } } },
      }),
      db.$queryRaw<{ lessonId: string }[]>`SELECT "lessonId" FROM "StudentLessonAccess" WHERE "studentId" = ${student.id}`,
    ])
    const assignedSet = new Set(assigned.map(row => row.lessonId))
    return NextResponse.json({ lessons: lessons.map(lesson => ({ ...lesson, assigned: assignedSet.has(lesson.id) })) })
  } catch {
    return NextResponse.json({ error: 'تعذر تحميل دروس الطالب' }, { status: 400 })
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdminAccess()
    const { id } = await params
    const student = await db.student.findUnique({ where: { userId: id }, select: { id: true } })
    if (!student) return NextResponse.json({ error: 'هذا الحساب ليس حساب طالب' }, { status: 400 })
    const data = bodySchema.parse(await req.json())
    const lesson = await db.lesson.findUnique({ where: { id: data.lessonId }, select: { id: true } })
    if (!lesson) return NextResponse.json({ error: 'الدرس غير موجود' }, { status: 404 })

    if (data.action === 'add') {
      await db.$executeRaw`INSERT INTO "StudentLessonAccess" ("id", "studentId", "lessonId") VALUES (${randomUUID()}, ${student.id}, ${lesson.id}) ON CONFLICT ("studentId", "lessonId") DO NOTHING`
    } else {
      await db.$executeRaw`DELETE FROM "StudentLessonAccess" WHERE "studentId" = ${student.id} AND "lessonId" = ${lesson.id}`
    }
    return NextResponse.json({ ok: true, action: data.action })
  } catch (e) {
    return NextResponse.json({ error: e instanceof z.ZodError ? 'بيانات غير صحيحة' : 'تعذر تعديل صلاحية الدرس' }, { status: 400 })
  }
}
