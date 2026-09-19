import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireRole } from '@/lib/auth'

// Student course access endpoint
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const u = await requireRole(['STUDENT'])
    if (!u.student) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })

    const { id } = await params
    if (!u.student.gradeId) {
      return NextResponse.json({ error: 'حساب الطالب غير مرتبط بصف دراسي' }, { status: 400 })
    }

    const course = await db.course.findFirst({
      where: { id, published: true, gradeId: u.student.gradeId },
      include: {
        grade: true,
        subject: true,
        teacher: { include: { user: true } },
        modules: {
          orderBy: { order: 'asc' },
          include: {
            lessons: {
              orderBy: { order: 'asc' },
              include: { video: true, assignments: { orderBy: { dueAt: 'asc' } } },
            },
          },
        },
      },
    })

    if (!course) {
      return NextResponse.json({ error: 'الكورس غير متاح لصفك' }, { status: 404 })
    }

    const [enrollment, purchase, progress, submissions, walletRows] = await Promise.all([
      db.courseEnrollment.findUnique({
        where: {
          studentId_courseId: {
            studentId: u.student.id,
            courseId: id,
          },
        },
      }),
      db.$queryRawUnsafe<any[]>(
        'SELECT "id" FROM "ContentPurchase" WHERE "studentId"=$1 AND "courseId"=$2 LIMIT 1',
        u.student.id,
        id,
      ),
      db.studentProgress.findMany({
        where: {
          studentId: u.student.id,
          lesson: { module: { courseId: id } },
        },
      }),
      db.assignmentSubmission.findMany({
        where: {
          studentId: u.student.id,
          assignment: { courseId: id },
          submittedAt: { not: null },
        },
        select: { assignmentId: true, submittedAt: true },
      }),
      db.$queryRawUnsafe<any[]>(
        'SELECT "balance" FROM "Wallet" WHERE "studentId"=$1 LIMIT 1',
        u.student.id,
      ),
      db.$queryRawUnsafe<any[]>(
        'SELECT "coverUrl" FROM "Course" WHERE "id"=$1 LIMIT 1',
        id,
      ),
    ])

    const enrolled = !!enrollment || purchase.length > 0
    const progressMap = new Map(progress.map((p) => [p.lessonId, p]))
    const submittedSet = new Set(submissions.map((s) => s.assignmentId))
    const balance = Number(walletRows[0]?.balance ?? 0)
    const totalLessons = course.modules.reduce((n, m) => n + m.lessons.length, 0)
    const completedLessons = course.modules.reduce(
      (n, m) => n + m.lessons.filter((l) => progressMap.get(l.id)?.completed).length,
      0,
    )
    const orderedLessons = course.modules.flatMap((m) => m.lessons)
    const lessonLock = new Map<string, boolean>()
    orderedLessons.forEach((lesson, index) => {
      if (!enrolled) {
        lessonLock.set(lesson.id, true)
        return
      }
      if (index === 0) {
        lessonLock.set(lesson.id, false)
        return
      }
      const previous = orderedLessons[index - 1]
      const previousAssignments = previous.assignments
      const previousSolved = previousAssignments.length === 0 || previousAssignments.every((a) => submittedSet.has(a.id))
      lessonLock.set(lesson.id, !previousSolved)
    })

    return NextResponse.json(
      {
        course: {
          id: course.id,
          title: course.title,
          description: course.description,
          coverUrl: course.coverUrl,
          price: Number(course.price),
          grade: course.grade.name,
          subject: course.subject.name,
          teacher: course.teacher.user.name,
          enrolled,
          balance,
          totalLessons,
          completedLessons,
          progress: totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0,
          modules: course.modules.map((m) => ({
            id: m.id,
            title: m.title,
            order: m.order,
            lessons: m.lessons.map((l) => ({
              id: l.id,
              title: l.title,
              order: l.order,
              hasVideo: !!l.video,
              locked: lessonLock.get(l.id) ?? true,
              lockedReason: lessonLock.get(l.id) ? 'أكمل واجب الدرس السابق أولًا' : null,
              progress: progressMap.get(l.id)?.watchedPct ?? 0,
              completed: progressMap.get(l.id)?.completed ?? false,
              assignments: l.assignments.map((a) => ({
                id: a.id,
                title: a.title,
                description: a.description,
                dueAt: a.dueAt,
                submitted: submittedSet.has(a.id),
              })),
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
