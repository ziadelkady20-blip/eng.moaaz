import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

export const runtime = 'nodejs'

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user?.student) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })

    const { id } = await params

    const lesson = await db.lesson.findUnique({
      where: { id },
      select: { id: true, title: true, moduleId: true, videoId: true },
    })

    if (!lesson) return NextResponse.json({ error: 'الدرس غير موجود' }, { status: 404 })

    const module = await db.courseModule.findUnique({
      where: { id: lesson.moduleId },
      select: { id: true, courseId: true },
    })
    if (!module) return NextResponse.json({ error: 'بيانات الدرس غير مكتملة' }, { status: 500 })

    const course = await db.course.findUnique({
      where: { id: module.courseId },
      select: { id: true, title: true, gradeId: true },
    })
    if (!course) return NextResponse.json({ error: 'الكورس المرتبط بالدرس غير موجود' }, { status: 500 })

    if (!user.student.gradeId || course.gradeId !== user.student.gradeId) {
      return NextResponse.json({ error: 'هذا الدرس غير متاح لصفك' }, { status: 403 })
    }

    const enrollment = await db.courseEnrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId: user.student.id,
          courseId: course.id,
        },
      },
    })

    if (!enrollment) {
      return NextResponse.json(
        { error: 'هذا المحتوى غير متاح لحسابك. يجب شراء الكورس من المحفظة أولًا.' },
        { status: 403 },
      )
    }

    let progress: any = null
    try {
      progress = await db.studentProgress.findUnique({
        where: { studentId_lessonId: { studentId: user.student.id, lessonId: id } },
      })
    } catch (error) {
      console.error('STUDENT_LESSON_PROGRESS_READ_ERROR', error)
    }

    let video: any = null
    if (lesson.videoId) {
      try {
        video = await db.video.findUnique({ where: { id: lesson.videoId } })
      } catch (error) {
        console.error('STUDENT_LESSON_VIDEO_READ_ERROR', error)
      }
    }

    let resources: any[] = []
    try {
      resources = await db.lessonResource.findMany({ where: { lessonId: id } })
    } catch (error) {
      console.error('STUDENT_LESSON_RESOURCES_READ_ERROR', error)
    }

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

    const videoId = video?.isPublished ? video.providerAssetId || video.youtubeUrl : null

    return NextResponse.json(
      {
        lesson: {
          id: lesson.id,
          title: lesson.title,
          course: course.title,
          video: videoId ? { provider: video?.provider || 'YOUTUBE', id: videoId } : null,
          resources,
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
