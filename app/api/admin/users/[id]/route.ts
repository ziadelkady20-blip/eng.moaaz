import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashPassword } from '@/lib/auth'
import { isSuperAdmin, requireAdminAccess } from '@/lib/admin-access'
import { z } from 'zod'

const roleSchema = z.enum(['STUDENT', 'PARENT', 'TEACHER', 'ADMIN', 'SUPPORT'])
const bodySchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  phone: z.string().trim().regex(/^01\d{9}$/).optional(),
  password: z.string().min(8).optional().or(z.literal('')),
  role: roleSchema.optional(),
  gradeId: z.string().nullable().optional(),
  schoolId: z.string().nullable().optional(),
  governorateId: z.string().nullable().optional(),
  guardianPhone: z.string().trim().regex(/^01\d{9}$/).nullable().optional().or(z.literal('')),
  studyType: z.enum(['ONLINE', 'CENTER', 'HYBRID']).optional(),
})

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdminAccess()
    const { id } = await params

    const user = await db.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        student: {
          select: {
            id: true,
            gradeId: true,
            schoolId: true,
            governorateId: true,
            guardianPhone: true,
            studyType: true,
            grade: { select: { id: true, name: true } },
            school: { select: { id: true, name: true } },
            governorate: { select: { id: true, name: true } },
            enrollments: {
              orderBy: { enrolledAt: 'desc' },
              select: {
                enrolledAt: true,
                course: {
                  select: {
                    id: true,
                    title: true,
                    coverUrl: true,
                    published: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'الحساب غير موجود' }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const actor = await requireAdminAccess()
    const { id } = await params
    const target = await db.user.findUnique({ where: { id }, include: { student: true } })

    if (!target) {
      return NextResponse.json({ error: 'الحساب غير موجود' }, { status: 404 })
    }

    const data = bodySchema.parse(await req.json())
    const actorIsSuperAdmin = isSuperAdmin(actor)

    if (isSuperAdmin(target) && !actorIsSuperAdmin) {
      return NextResponse.json({ error: 'حساب السوبر أدمن محمي' }, { status: 403 })
    }

    if (target.role === 'ADMIN' && data.role !== undefined && data.role !== 'ADMIN' && !actorIsSuperAdmin) {
      return NextResponse.json({ error: 'تغيير صلاحية مدير متاح للسوبر أدمن فقط' }, { status: 403 })
    }

    if (data.role === 'ADMIN' && target.role !== 'ADMIN' && !actorIsSuperAdmin) {
      return NextResponse.json({ error: 'ترقية الحسابات إلى ADMIN متاحة للسوبر أدمن فقط' }, { status: 403 })
    }

    if (data.phone && data.phone !== target.phone) {
      const exists = await db.user.findUnique({ where: { phone: data.phone } })
      if (exists) {
        return NextResponse.json({ error: 'رقم الهاتف مستخدم بالفعل' }, { status: 409 })
      }
    }

    const userData: Record<string, unknown> = {}
    if (data.name !== undefined) userData.name = data.name
    if (data.phone !== undefined) userData.phone = data.phone
    if (data.role !== undefined) userData.role = data.role
    if (data.password) userData.passwordHash = hashPassword(data.password)

    await db.$transaction(async (tx) => {
      if (Object.keys(userData).length) {
        await tx.user.update({ where: { id }, data: userData })
      }

      if (target.student) {
        const studentData: Record<string, unknown> = {}
        if (data.gradeId !== undefined) studentData.gradeId = data.gradeId
        if (data.schoolId !== undefined) studentData.schoolId = data.schoolId
        if (data.governorateId !== undefined) studentData.governorateId = data.governorateId
        if (data.guardianPhone !== undefined) studentData.guardianPhone = data.guardianPhone || null
        if (data.studyType !== undefined) studentData.studyType = data.studyType

        if (Object.keys(studentData).length) {
          await tx.student.update({ where: { id: target.student.id }, data: studentData })
        }
      }
    })

    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof z.ZodError ? 'بيانات التعديل غير صحيحة' : 'تعذر تعديل الحساب' },
      { status: 400 },
    )
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const actor = await requireAdminAccess()
    const { id } = await params

    if (id === actor.id) {
      return NextResponse.json({ error: 'لا يمكنك حذف الحساب الذي تستخدمه حاليًا' }, { status: 400 })
    }

    const target = await db.user.findUnique({ where: { id } })
    if (!target) {
      return NextResponse.json({ error: 'الحساب غير موجود' }, { status: 404 })
    }

    if (isSuperAdmin(target) && !isSuperAdmin(actor)) {
      return NextResponse.json({ error: 'حساب السوبر أدمن محمي' }, { status: 403 })
    }

    await db.user.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'تعذر حذف الحساب' }, { status: 400 })
  }
}
