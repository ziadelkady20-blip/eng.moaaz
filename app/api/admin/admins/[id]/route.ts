import { NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { hashPassword } from '@/lib/auth'
import { requireSuperAdmin } from '@/lib/admin-access'

const schema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  password: z.string().min(8).max(100).optional(),
})

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const current = await requireSuperAdmin()
    const { id } = await params
    if (id === current.id) return NextResponse.json({ error: 'لا تعدل بيانات السوبر أدمن من هنا' }, { status: 400 })
    const body = schema.parse(await req.json())
    if (!body.name && !body.password) return NextResponse.json({ error: 'أرسل الاسم أو كلمة المرور' }, { status: 400 })
    const existing = await db.user.findUnique({ where: { id } })
    if (!existing || existing.role !== 'ADMIN') return NextResponse.json({ error: 'حساب الأدمن غير موجود' }, { status: 404 })
    const admin = await db.user.update({
      where: { id },
      data: {
        ...(body.name ? { name: body.name } : {}),
        ...(body.password ? { passwordHash: hashPassword(body.password) } : {}),
      },
      select: { id: true, name: true, phone: true, role: true, updatedAt: true },
    })
    await db.auditLog.create({ data: { actorId: current.id, action: 'UPDATE_ADMIN', entity: 'USER', entityId: id, metadata: JSON.stringify({ changedName: Boolean(body.name), changedPassword: Boolean(body.password) }) } })
    return NextResponse.json({ admin })
  } catch (error) {
    const forbidden = error instanceof Error && error.message === 'SUPER_ADMIN_REQUIRED'
    return NextResponse.json({ error: forbidden ? 'غير مصرح' : 'تعذر تحديث الأدمن' }, { status: forbidden ? 403 : 400 })
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const current = await requireSuperAdmin()
    const { id } = await params
    if (id === current.id) return NextResponse.json({ error: 'لا يمكن إزالة صلاحيات حسابك الحالي' }, { status: 400 })
    const existing = await db.user.findUnique({ where: { id } })
    if (!existing || existing.role !== 'ADMIN') return NextResponse.json({ error: 'حساب الأدمن غير موجود' }, { status: 404 })
    const admin = await db.user.update({ where: { id }, data: { role: 'SUPPORT' }, select: { id: true, name: true, phone: true, role: true, updatedAt: true } })
    await db.auditLog.create({ data: { actorId: current.id, action: 'REMOVE_ADMIN_ROLE', entity: 'USER', entityId: id, metadata: JSON.stringify({ previousRole: 'ADMIN', nextRole: 'SUPPORT' }) } })
    return NextResponse.json({ ok: true, admin })
  } catch (error) {
    const forbidden = error instanceof Error && error.message === 'SUPER_ADMIN_REQUIRED'
    return NextResponse.json({ error: forbidden ? 'غير مصرح' : 'تعذر إزالة صلاحيات الأدمن' }, { status: forbidden ? 403 : 400 })
  }
}
