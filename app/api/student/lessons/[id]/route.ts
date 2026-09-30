import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user?.student) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })

    const { id } = await params

    // Keep the core lesson query small and independent from the optional
    // assignment/submission data. This prevents a problem in the assignment
    // tables from taking the whole lesson/video page down with a 500.
    const lesson = await db.lesson.findUnique({
      where: { id },
      include: {
        module: { include: { course: true } },
        video: true,
        resources: true,
      },
    })

    if (!lesson) return NextResponse.json({ error: 'الدرس غير موجود' }, { status: 404 })

    if (!user.student.gradeId || lesson.module.course.gradeId !== user.student.gradeId) {
      return NextResponse.json({ error: 'هذا الدرس غير متاح لصفك' }, { status: 403 })
    }

    const enrollment = await db.courseEnrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId: user.student.id,
          courseId: lesson.module.courseId,
        },
      },
    })

    if (!enrollment) {
      return NextResponse.json(
        { error: 'هذا المحتوى غير متاح لحسابك. يجب شراء الكورس من المحفظة أولًا.' },
        { status: 403 },
      )
    }

    const progress = await db.studentProgress.findUnique({
      where: { studentId_lessonId: { studentId: user.student.id, lessonId: id } },
    })

    // Assignments are optional for opening a lesson. Read them separately so
    // an assignment/submission data problem cannot break the video itself.
    let assignments: any[] = []
    try {
      assignments = await db.assignment.findMany({
        where: { lessonId: id },
        orderBy: { dueAt: 'asc' },
      })
    } catch (error) {
      console.error('STUDENT_LESSON_ASSIGNMENTS_READ_ERROR', error)
    }

    const submissionMap = new Map<string, any>()
    if (assignments.length) {
      try {
        const submissions = await db.assignmentSubmission.findMany({
          where: {
            studentId: user.student.id,
            assignmentId: { in: assignments.map((a) => a.id) },
          },
          select: {
            assignmentId: true,
            submittedAt: true,
            score: true,
            feedback: true,
            fileUrl: true,
          },
        })
        for (const submission of submissions) submissionMap.set(submission.assignmentId, submission)
      } catch (error) {
        console.error('STUDENT_LESSON_SUBMISSIONS_READ_ERROR', error)
      }
    }

    const videoId = lesson.video?.isPublished
      ? lesson.video.providerAssetId || lesson.video.youtubeUrl
      : null

    return NextResponse.json(
      {
        lesson: {
          id: lesson.id,
          title: lesson.title,
          course: lesson.module.course.title,
          video: videoId
            ? { provider: lesson.video?.provider || 'YOUTUBE', id: videoId }
            : null,
          resources: lesson.resources,
          assignments: assignments.map((a) => ({
            id: a.id,
            title: a.title,
            description: a.description,
            dueAt: a.dueAt,
            submission: submissionMap.get(a.id) || null,
          })),
          progress: progress ?? { watchedPct: 0, lastPositionSec: 0, completed: false },
        },
        viewer: { name: user.name, phone: user.phone },
      },
      {
        headers: {
          'Cache-Control': 'private, no-store, max-age=0',
          'X-Content-Type-Options': 'nosniff',
        },
      },
    )
  } catch (error) {
    console.error('STUDENT_LESSON_GET_ERROR', error)
    return NextResponse.json(
      { error: 'تعذر تحميل الدرس حاليًا. حاول تحديث الصفحة مرة أخرى.' },
      { status: 500 },
    )
  }
}
