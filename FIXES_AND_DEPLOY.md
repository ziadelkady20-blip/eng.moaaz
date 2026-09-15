# تقرير الإصلاح + خطوات الحصول على Live Preview

## الحالة
- قبل الإصلاح: **الـ Build يفشل تمامًا** (schema غير صالح + أخطاء Syntax + أخطاء TypeScript). أي رفع على Vercel كان سيفشل.
- بعد الإصلاح: `next build` ينجح، السيرفر يعمل، الصفحات ترجع 200، الـ middleware يحمي مسارات student/teacher/admin ويحوّل لصفحة الدخول، و الـ migrations تُطبَّق على PostgreSQL بنجاح.

## الأخطاء التي تم إصلاحها (بالحد الأدنى، بدون تغيير التصميم)

1. `prisma/schema.prisma` — كان الملف مكتوبًا كله في أسطر مضغوطة، وصيغة Prisma تتطلب كل حقل في سطر مستقل (62 خطأ تحقّق). أُعيد التنسيق فقط، دون تغيير أي حقل أو علاقة.
2. `model Order` — السمة `@relation(fields:[couponCode], references:[code])` كانت على الحقل `invoice` بدل `coupon`. ملف الـ migration يؤكد أن المفتاح الأجنبي `Order.couponCode -> Coupon.code`.
3. `model Lesson` — الحقل `videoId` ينقصه `@unique` رغم أن الـ migration ينشئه `UNIQUE` (علاقة 1:1 مع `Video`).
4. أقواس ناقصة (Syntax Error) في ثلاثة ملفات:
   - `app/api/student/lessons/[id]/route.ts`
   - `app/api/student/courses/[id]/route.ts`
   - `app/api/parent/children/[id]/analytics/route.ts`
5. توافق Next.js 15: `params` صار `Promise`. صُحّح عبر `use()` في:
   - `app/parent/children/[id]/page.tsx`
   - `app/parent/children/[id]/analytics/page.tsx`
   - `app/teacher/courses/[id]/page.tsx`
6. `useEffect(load, [])` بدالة `async` في: `app/admin/users`, `app/admin/courses`, `app/admin/payments` → `useEffect(() => { load() }, [])`.
7. خطأ منطقي في `app/api/admin/payments/[id]/confirm/route.ts`:
   - `tx.order.update({ where: { id } })` كان يستخدم مُعرّف الـ Payment بدل `payment.orderId` (مسار الاسترداد refund يستخدمه بشكل صحيح) — لم يكن تأكيد أي دفعة لينجح.
   - `order.course.title` غير متاح على نتيجة `update` → استُبدل بـ `payment.order.course.title`.
8. `app/api/orders/route.ts` — `payments:{create:{method, reference}}` بمتغيرات غير معرّفة → `{ method: x.method, reference: x.reference }`.
9. `prisma/seed.ts` — خطأ نوع في مصفوفة الدرجات → تحديد النوع `[string, number, number][]`.

## التشغيل محليًا (يعطيك الموقع كاملًا على http://localhost:3000)

```bash
npm install
cp .env.example .env   # ثم املأ القيم
npx prisma generate
npx prisma migrate deploy
npm run db:seed
npm run build
npm start
```

قيم `.env` المطلوبة:

```
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/taallum?sslmode=require"
AUTH_SECRET="<نص عشوائي 32 حرفًا أو أكثر>"
PAYMENT_WEBHOOK_SECRET="<نص عشوائي مختلف>"
TOKEN_ENCRYPTION_KEY="<نص عشوائي مختلف>"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

لتوليد السرّ: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

## النشر على Preview عام (Vercel + Neon) — حوالي 5 دقائق

1. **قاعدة البيانات**: أنشئ مشروعًا مجانيًا على neon.tech وانسخ الـ Connection String.
2. **الرفع**: ارفع المجلد على مستودع GitHub، ثم في vercel.com اختر Import Project.
3. **متغيرات البيئة** في Vercel: أضف الخمسة أعلاه، مع `NEXT_PUBLIC_APP_URL` = رابط Vercel الذي ستحصل عليه.
4. **Build Command** في Vercel: `prisma generate && prisma migrate deploy && next build`
5. بعد أول Deploy، شغّل البذور مرة واحدة من جهازك مع نفس `DATABASE_URL`: `npm run db:seed`

متغيرات YouTube اختيارية؛ بدونها تعمل المنصة لكن رفع الفيديو عبر YouTube معطّل.

## حسابات التجربة (من ملف seed)

- طالب: `01000000000` / `Demo1234!`
- مشرف: `01200000000` / `Admin1234!`
