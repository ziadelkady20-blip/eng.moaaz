import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireRole } from '@/lib/auth'
import { Prisma } from '@prisma/client'

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const u = await requireRole(['STUDENT'])
    if (!u.student) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })

    const { id } = await params
    const course = await db.course.findFirst({
      where: { id, published: true, gradeId: u.student.gradeId ?? undefined },
      include: {
        grade: true,
        subject: true,
        teacher: { include: { user: true } },
        modules: {
          orderBy: { order: 'asc' },
          include: { lessons: { orderBy: { order: 'asc' }, include: { video: true } } },
        },
      },
    })

    if (!course) return NextResponse.json({ error: 'الكورس غير متاح لصفك' }, { status: 404 })

    const [enrollment, purchase, progress, walletRows] = await Promise.all([
      db.courseEnrollment.findUnique({
        where: { studentId_courseId: { studentId: u.student.id, courseId: id } },
      }),
      db.$queryRaw<any[]>(Prisma.sql`
        SELECT "id"
        FROM "ContentPurchase"
        WHERE "studentId"=${u.student.id} AND "courseId"=${id}
        LIMIT 1
      `),
      db.studentProgress.findMany({
        where: { studentId: u.student.id, lesson: { module: { courseId: id } } },
      }),
      db.$queryRaw<any[]>(Prisma.sql`
        SELECT "balance"
        FROM "Wallet"
        WHERE "studentId"=${u.student.id}
        LIMIT 1
      `),
    ])

    const enrolled = !!enrollment || purchase.length > 0
    const map = new Map(progress.map(p => [p.lessonId, p]))
    const balance = Number(walletRows[0]?.balance ?? 0)

    return NextResponse.json(
      {
        course: {
          id: course.id,
          title: course.title,
          description: course.description,
          price: Number(course.price),
          grade: course.grade.name,
          subject: course.subject.name,
          teacher: course.teacher.user.name,
          enrolled,
          balance,
          modules: course.modules.map(m => ({
            id: m.id,
            title: m.title,
            lessons: m.lessons.map(l => ({
              id: l.id,
              title: l.title,
              order: l.order,
              hasVideo: !!l.video,
              locked: !enrolled,
              progress: map.get(l.id)?.watchedPct ?? 0,
              completed: map.get(l.id)?.completed ?? false,
            })),
          })),
        },
      },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } },
    )
  } catch (e) {
    console.error('STUDENT_COURSE_GET_ERROR', e)
    return NextResponse.json({ error: 'تعذر تحميل الكورس' }, { status: 400 })
  }
}
