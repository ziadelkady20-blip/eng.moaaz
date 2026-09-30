import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAdminAccess } from '@/lib/admin-access'
import { z } from 'zod'

const bodySchema = z.object({ courseId: z.string(), action: z.enum(['add', 'remove']) })

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdminAccess()
    const { id } = await params
    const student = await db.student.findUnique({ where: { userId: id }, select: { id: true } })
    if (!student) return NextResponse.json({ error: 'هذا الحساب ليس حساب طالب' }, { status: 400 })
    const [courses, enrollments] = await Promise.all([
      db.course.findMany({ orderBy: { createdAt: 'desc' }, select: { id: true, title: true, price: true, published: true, grade: { select: { name: true } }, subject: { select: { name: true } }, _count: { select: { modules: true, enrollments: true } } } }),
      db.courseEnrollment.findMany({ where: { studentId: student.id }, select: { courseId: true, enrolledAt: true } }),
    ])
    const enrolled = new Set(enrollments.map(e => e.courseId))
    return NextResponse.json({ courses: courses.map(course => ({ ...course, enrolled: enrolled.has(course.id) })) })
  } catch {
    return NextResponse.json({ error: 'تعذر تحميل كورسات الطالب' }, { status: 400 })
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdminAccess()
    const { id } = await params
    const student = await db.student.findUnique({ where: { userId: id }, select: { id: true } })
    if (!student) return NextResponse.json({ error: 'هذا الحساب ليس حساب طالب' }, { status: 400 })
    const data = bodySchema.parse(await req.json())
    const course = await db.course.findUnique({ where: { id: data.courseId }, select: { id: true } })
    if (!course) return NextResponse.json({ error: 'الكورس غير موجود' }, { status: 404 })

    if (data.action === 'add') {
      await db.courseEnrollment.upsert({ where: { studentId_courseId: { studentId: student.id, courseId: course.id } }, create: { studentId: student.id, courseId: course.id }, update: {} })
    } else {
      await db.courseEnrollment.deleteMany({ where: { studentId: student.id, courseId: course.id } })
    }
    return NextResponse.json({ ok: true, action: data.action })
  } catch (e) {
    return NextResponse.json({ error: e instanceof z.ZodError ? 'بيانات غير صحيحة' : 'تعذر تعديل صلاحية الكورس' }, { status: 400 })
  }
}
