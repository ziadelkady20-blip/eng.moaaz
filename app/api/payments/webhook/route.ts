import { NextResponse } from 'next/server'
import { createHmac, timingSafeEqual } from 'node:crypto'
import { db } from '@/lib/db'

export async function POST(req: Request) {
  const secret = process.env.PAYMENT_WEBHOOK_SECRET
  if (!secret) return NextResponse.json({ error: 'Webhook not configured' }, { status: 503 })

  const raw = await req.text()
  const signature = req.headers.get('x-payment-signature') || ''
  const expected = createHmac('sha256', secret).update(raw).digest('hex')
  const a = Buffer.from(signature)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !timingSafeEqual(a, b)) return NextResponse.json({ error: 'invalid signature' }, { status: 401 })

  let event: { eventId?: string; orderId?: string; status?: string; reference?: string; method?: string; amount?: number }
  try { event = JSON.parse(raw) } catch { return NextResponse.json({ error: 'invalid payload' }, { status: 400 }) }
  if (!event.eventId || !event.orderId || !event.status) return NextResponse.json({ error: 'invalid payload' }, { status: 400 })

  try {
    await db.$transaction(async tx => {
      try {
        await tx.paymentWebhookEvent.create({ data: { eventId: event.eventId!, status: 'PROCESSING', orderId: event.orderId! } })
      } catch {
        const existing = await tx.paymentWebhookEvent.findUnique({ where: { eventId: event.eventId! } })
        if (existing?.status === 'PROCESSED' || existing?.status === 'IGNORED') throw new Error('WEBHOOK_DEDUPLICATED')
        await tx.paymentWebhookEvent.update({ where: { eventId: event.eventId! }, data: { status: 'PROCESSING', orderId: event.orderId! } })
      }

      if (event.status !== 'paid') {
        await tx.paymentWebhookEvent.update({ where: { eventId: event.eventId! }, data: { status: 'IGNORED' } })
        return
      }

      const order = await tx.order.findUnique({ where: { id: event.orderId! }, include: { payments: true, course: true } })
      if (!order) throw new Error('ORDER_NOT_FOUND')
      if (event.amount !== undefined && Number(event.amount) !== Number(order.amount)) throw new Error('AMOUNT_MISMATCH')

      if (order.status !== 'CONFIRMED') {
        const payment = order.payments[0] || await tx.payment.create({ data: { orderId: order.id } })
        await tx.payment.update({ where: { id: payment.id }, data: { status: 'CONFIRMED', reference: event.reference, method: event.method, confirmedAt: new Date() } })
        await tx.order.update({ where: { id: order.id }, data: { status: 'CONFIRMED' } })
        if (order.couponCode) await tx.coupon.updateMany({ where: { code: order.couponCode, usedCount: { lt: 2147483647 } }, data: { usedCount: { increment: 1 } } })
        await tx.courseEnrollment.upsert({ where: { studentId_courseId: { studentId: order.studentId, courseId: order.courseId } }, create: { studentId: order.studentId, courseId: order.courseId }, update: {} })
        await tx.subscription.upsert({ where: { studentId_courseId: { studentId: order.studentId, courseId: order.courseId } }, create: { studentId: order.studentId, courseId: order.courseId }, update: { status: 'ACTIVE', startsAt: new Date() } })
        await tx.invoice.upsert({ where: { orderId: order.id }, create: { orderId: order.id, number: `INV-${order.id.slice(-10).toUpperCase()}`, amount: order.amount }, update: { amount: order.amount } })
        const student = await tx.student.findUniqueOrThrow({ where: { id: order.studentId } })
        await tx.notification.create({ data: { userId: student.userId, title: 'تم تفعيل الكورس', body: `تم تأكيد الدفع وفتح كورس ${order.course.title}` } })
      }
      await tx.paymentWebhookEvent.update({ where: { eventId: event.eventId! }, data: { status: 'PROCESSED', orderId: order.id } })
    })
    return NextResponse.json({ ok: true })
  } catch (error) {
    if (error instanceof Error && error.message === 'WEBHOOK_DEDUPLICATED') return NextResponse.json({ ok: true, deduplicated: true })
    return NextResponse.json({ error: 'webhook processing failed' }, { status: 400 })
  }
}
