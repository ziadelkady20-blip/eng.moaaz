import { NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { hashPassword } from '@/lib/auth'
import { requireSuperAdmin } from '@/lib/admin-access'

const createSchema = z.object({
  name: z.string().min(2).max(100),
  phone: z.string().min(8).max(20),
  password: z.string().min(8).max(100),
})

export async function GET() {
  try {
    await requireSuperAdmin()
    const admins = await db.user.findMany({
      where: { role: 'ADMIN' },
      select: { id: true, name: true, phone: true, role: true, createdAt: true, updatedAt: true },
      orderBy: { createdAt: 'asc' },
    })
    return NextResponse.json({ admins })
  } catch (error) {
    const status = error instanceof Error && error.message === 'SUPER_ADMIN_REQUIRED' ? 403 : 401
    return NextResponse.json({ error: 'غير مصرح' }, { status })
  }
}

export async function POST(req: Request) {
  try {
    const current = await requireSuperAdmin()
    const data = createSchema.parse(await req.json())
    if (data.phone === current.phone) return NextResponse.json({ error: 'لا يمكن تكرار حسابك' }, { status: 400 })
    const exists = await db.user.findUnique({ where: { phone: data.phone }, select: { id: true } })
    if (exists) return NextResponse.json({ error: 'رقم الهاتف مستخدم بالفعل' }, { status: 409 })
    const admin = await db.user.create({
      data: { name: data.name, phone: data.phone, passwordHash: hashPassword(data.password), role: 'ADMIN' },
      select: { id: true, name: true, phone: true, role: true, createdAt: true },
    })
    return NextResponse.json({ admin }, { status: 201 })
  } catch (error) {
    const status = error instanceof Error && error.message === 'SUPER_ADMIN_REQUIRED' ? 403 : 400
    return NextResponse.json({ error: status === 403 ? 'غير مصرح' : 'بيانات غير صحيحة' }, { status })
  }
}
