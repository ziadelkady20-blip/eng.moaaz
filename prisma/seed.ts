import { PrismaClient, Role, StudyType, AttendanceStatus } from '@prisma/client'
import { randomBytes, scryptSync } from 'node:crypto'

const db = new PrismaClient()
const hash = (p: string) => {
  const salt = randomBytes(16).toString('hex')
  return `${salt}:${scryptSync(p, salt, 64).toString('hex')}`
}

const SUPER_ADMIN_PHONE = process.env.SUPER_ADMIN_PHONE || '01200000000'
const SUPER_ADMIN_PASSWORD = process.env.SUPER_ADMIN_PASSWORD || 'Admin1234!'

async function main() {
  if (process.env.NODE_ENV === 'production' && !process.env.SUPER_ADMIN_PASSWORD) {
    throw new Error('SUPER_ADMIN_PASSWORD is required when seeding production')
  }

  const gov = await db.governorate.upsert({
    where: { name: 'الفيوم' },
    update: {},
    create: { name: 'الفيوم' },
  })
  const grades = [] as any[]
  for (const name of ['الصف الأول الثانوي', 'الصف الثاني الثانوي', 'الصف الثالث الثانوي']) {
    grades.push(await db.grade.upsert({ where: { name }, update: {}, create: { name } }))
  }

  await db.coupon.upsert({
    where: { code: 'WELCOME10' },
    update: {},
    create: { code: 'WELCOME10', type: 'PERCENT', value: 10, active: true },
  })

  const grade = grades[2]
  const subject = await db.subject.upsert({
    where: { name: 'اللغة العربية' },
    update: {},
    create: { name: 'اللغة العربية' },
  })

  const user = await db.user.upsert({
    where: { phone: '01000000000' },
    update: { name: 'أحمد محمد', role: Role.STUDENT },
    create: { phone: '01000000000', name: 'أحمد محمد', passwordHash: hash('Demo1234!'), role: Role.STUDENT },
  })
  const student = await db.student.upsert({
    where: { userId: user.id },
    update: { gradeId: grade.id, governorateId: gov.id, studyType: StudyType.HYBRID },
    create: { userId: user.id, gradeId: grade.id, governorateId: gov.id, studyType: StudyType.HYBRID },
  })

  const existingAdmin = await db.user.findUnique({ where: { phone: SUPER_ADMIN_PHONE } })
  const admin = existingAdmin
    ? await db.user.update({ where: { id: existingAdmin.id }, data: { role: Role.ADMIN, name: existingAdmin.name || 'مدير المنصة' } })
    : await db.user.create({
        data: {
          phone: SUPER_ADMIN_PHONE,
          name: 'مدير المنصة',
          passwordHash: hash(SUPER_ADMIN_PASSWORD),
          role: Role.ADMIN,
        },
      })

  const teacherUser = await db.user.upsert({
    where: { phone: '01100000000' },
    update: { passwordHash: hash('Demo1234!'), role: Role.TEACHER },
    create: { phone: '01100000000', name: 'أستاذ أحمد', passwordHash: hash('Demo1234!'), role: Role.TEACHER },
  })
  const teacher = await db.teacher.upsert({ where: { userId: teacherUser.id }, update: {}, create: { userId: teacherUser.id } })

  let course = await db.course.findFirst({ where: { title: 'اللغة العربية', teacherId: teacher.id } })
  if (!course) {
    course = await db.course.create({
      data: {
        title: 'اللغة العربية',
        description: 'كورس متكامل للنحو والقراءة والتعبير.',
        gradeId: grade.id,
        subjectId: subject.id,
        teacherId: teacher.id,
        price: 199,
        published: true,
        modules: {
          create: [{
            title: 'النحو',
            order: 1,
            lessons: {
              create: [
                { title: 'المفعول به', order: 1 },
                { title: 'المفعول المطلق', order: 2 },
              ],
            },
          }],
        },
      },
    })
  }

  await db.courseEnrollment.upsert({
    where: { studentId_courseId: { studentId: student.id, courseId: course.id } },
    update: {},
    create: { studentId: student.id, courseId: course.id },
  })

  const module = await db.courseModule.findFirstOrThrow({ where: { courseId: course.id } })
  const lesson = await db.lesson.findFirstOrThrow({ where: { moduleId: module.id, order: 1 } })
  await db.studentProgress.upsert({
    where: { studentId_lessonId: { studentId: student.id, lessonId: lesson.id } },
    update: { watchedPct: 62, lastPositionSec: 740 },
    create: { studentId: student.id, lessonId: lesson.id, watchedPct: 62, lastPositionSec: 740 },
  })

  let exam = await db.exam.findFirst({ where: { title: 'اختبار الوحدة الأولى', courseId: course.id } })
  if (!exam) {
    exam = await db.exam.create({
      data: {
        title: 'اختبار الوحدة الأولى',
        durationMin: 30,
        courseId: course.id,
        questions: {
          create: [
            {
              text: 'ما إعراب كلمة «الطالب» في جملة «نجح الطالب»؟',
              type: 'MCQ',
              points: 1,
              options: { create: [
                { text: 'فاعل', isCorrect: true },
                { text: 'مفعول به', isCorrect: false },
                { text: 'مبتدأ', isCorrect: false },
                { text: 'خبر', isCorrect: false },
              ] },
            },
            {
              text: 'المفعول به يكون منصوبًا.',
              type: 'MCQ',
              points: 1,
              options: { create: [
                { text: 'صواب', isCorrect: true },
                { text: 'خطأ', isCorrect: false },
              ] },
            },
          ],
        },
      },
    })
  }

  let assignment = await db.assignment.findFirst({ where: { title: 'تدريبات النحو — الوحدة الأولى', courseId: course.id } })
  if (!assignment) {
    assignment = await db.assignment.create({
      data: {
        title: 'تدريبات النحو — الوحدة الأولى',
        description: 'حل ورقة التدريبات ورفع الإجابة.',
        dueAt: new Date(Date.now() + 86400000 * 2),
        courseId: course.id,
      },
    })
  }

  const old = await db.attendance.count({ where: { studentId: student.id } })
  if (!old) {
    for (let i = 0; i < 8; i++) {
      await db.attendance.create({
        data: {
          studentId: student.id,
          status: i === 3 ? AttendanceStatus.ABSENT : i === 5 ? AttendanceStatus.LATE : AttendanceStatus.PRESENT,
          date: new Date(Date.now() - i * 86400000),
        },
      })
    }
  }

  if (!(await db.studentGrade.count({ where: { studentId: student.id } }))) {
    for (const [title, score, maxScore] of [
      ['اختبار النحو', 18, 20],
      ['اختبار القراءة', 17, 20],
      ['تقييم الوحدة', 9, 10],
    ] as [string, number, number][]) {
      await db.studentGrade.create({
        data: { studentId: student.id, subjectId: subject.id, gradeId: grade.id, title, score, maxScore },
      })
    }
  }

  if (!(await db.notification.count({ where: { userId: user.id } }))) {
    await db.notification.create({ data: { userId: user.id, title: 'اختبار جديد متاح', body: 'اختبار الوحدة الأولى متاح الآن.' } })
  }

  await db.siteSetting.upsert({
    where: { id: 'site' },
    update: {},
    create: {
      id: 'site',
      data: {
        brandName: 'Eng Moaaz Ismail',
        siteName: 'المنصة التعليمية',
        announcement: '',
        heroBadge: 'منصة تعليمية متكاملة',
        heroTitle: 'تعلم صح، تابع تقدمك، وحقق هدفك',
        heroDescription: 'منصة تعليمية تجمع الشرح والفيديوهات والاختبارات والواجبات والمتابعة في مكان واحد.',
        heroPrimaryLabel: 'ابدأ الآن',
        heroPrimaryUrl: '/register',
        heroSecondaryLabel: 'استكشف الكورسات',
        heroSecondaryUrl: '#stages',
        footerText: '© Eng Moaaz Ismail 2026',
        supportPhone: '',
        whatsapp: '',
        seoTitle: 'Eng Moaaz Ismail | المنصة التعليمية',
        seoDescription: 'منصة Eng Moaaz Ismail التعليمية لطلاب المرحلة الثانوية.',
      },
      updatedById: admin.id,
    },
  })

  console.log('seeded', {
    student: '01000000000 / Demo1234!',
    admin: `${SUPER_ADMIN_PHONE} / ${process.env.NODE_ENV === 'production' ? '[configured in env]' : SUPER_ADMIN_PASSWORD}`,
    course: course.id,
    exam: exam.id,
    assignment: assignment.id,
  })
}

main()
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
  .finally(() => db.$disconnect())
