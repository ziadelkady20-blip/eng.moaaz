import { NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'
import { z } from 'zod'
import { db } from '@/lib/db'
import { hashPassword, normalizePhone, setSession } from '@/lib/auth'
import { Role, StudyType } from '@prisma/client'

const phone = z.preprocess(value => typeof value === 'string' ? normalizePhone(value) : value, z.string().regex(/^01\d{9}$/))

const schema = z.object({
  name: z.string().trim().min(3).max(100),
  phone,
  password: z.string().min(8).max(128),
  gradeId: z.string().optional(),
  governorateId: z.string().optional(),
  schoolId: z.string().optional(),
  studyType: z.enum(['ONLINE', 'CENTER', 'HYBRID']).default('ONLINE'),
  guardianPhone: z.preprocess(value => value ? normalizePhone(String(value)) : undefined, z.string().regex(/^01\d{9}$/).optional()),
})

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const rl = rateLimit(`register:${ip}`, 5, 60_000)
  if (!rl.ok) {
    return NextResponse.json({ error: 'محاولات كثيرة. حاول بعد دقيقة.' }, {
      status: 429,
      headers: { 'Retry-After': '60' },
    })
  }

  try {
    const body = schema.parse(await req.json())
    const exists = await db.user.findUnique({ where: { phone: body.phone } })
    if (exists) return NextResponse.json({ error: 'رقم الهاتف مسجل بالفعل' }, { status: 409 })

    const grade = body.gradeId
      ? await db.grade.findFirst({ where: { OR: [{ id: body.gradeId }, { name: body.gradeId }] } })
      : null
    const governorate = body.governorateId
      ? await db.governorate.findFirst({ where: { OR: [{ id: body.governorateId }, { name: body.governorateId }] } })
      : null

    let schoolId: string | undefined
    if (body.schoolId) {
      const school = await db.school.findFirst({
        where: {
          OR: [{ id: body.schoolId }, { name: body.schoolId }],
          ...(governorate?.id ? { governorateId: governorate.id } : {}),
        },
      })
      if (school) schoolId = school.id
    }

    const user = await db.user.create({
      data: {
        name: body.name,
        phone: body.phone,
        passwordHash: hashPassword(body.password),
        role: Role.STUDENT,
        student: {
          create: {
            gradeId: grade?.id,
            governorateId: governorate?.id,
            schoolId,
            studyType: StudyType[body.studyType],
            guardianPhone: body.guardianPhone,
          },
        },
      },
      include: { student: true },
    })

    await setSession(user.id, user.role)
    return NextResponse.json({
      user: { id: user.id, name: user.name, role: user.role, student: user.student },
    }, { status: 201 })
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: 'بيانات التسجيل غير صحيحة' }, { status: 400 })
    }
    if ((e as { code?: string })?.code === 'P2002') {
      return NextResponse.json({ error: 'رقم الهاتف مسجل بالفعل' }, { status: 409 })
    }
    console.error('REGISTER_ERROR', e)
    return NextResponse.json({ error: 'حدث خطأ أثناء إنشاء الحساب' }, { status: 500 })
  }
}
