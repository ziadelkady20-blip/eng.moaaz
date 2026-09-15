# Eng Moaaz Ismail — Taallum Platform V10

Arabic-first RTL LMS for Egyptian General Secondary students: الصف الأول والثاني والثالث الثانوي العام.

## V13 Release Candidate / Final Audit
- Signed, HTTP-only session cookie with constant-time signature verification.
- Production requires `AUTH_SECRET`; development uses a dev-only fallback.
- Route middleware redirects unauthenticated access to protected product areas.
- Security headers including CSP, frame policy, referrer policy and permissions policy.
- Rate limiting for login and registration attempts.
- Global loading, error and 404 states.
- Responsive/mobile accessibility refinements and focus-visible states.
- Health endpoint at `/api/health`.
- Robots and sitemap metadata routes.
- Payment/coupon lifecycle hardened: coupon usage is consumed on confirmed payment, not merely order creation; refunds restore usage safely.
- Server-side authorization remains mandatory for APIs and protected content.

## V9 Payments
- Course checkout and order creation.
- Manual payment methods and reference numbers.
- Coupon validation/discount calculation.
- Admin confirmation creates a course enrollment in a database transaction.
- Refund removes enrollment and restores coupon usage.

## V8 Parent & Teacher
- Parent dashboard reads linked children from Prisma and shows attendance/grades/courses/exams.
- Parent child analytics endpoint enforces parent-child relationship server-side.
- Teacher dashboard reads teacher-owned courses and live student counts.
- Teacher students list, attendance recording and assignment submissions are connected to the database.

## V7 Student
- Student dashboard, course detail, lessons, protected YouTube video access, persisted progress, exams/attempts, assignments, books, attendance, grades and notifications.

## V6 Admin/YouTube
- Admin course/video management foundations.
- Google/YouTube OAuth upload integration code.
- YouTube provider IDs are exposed only after server-side enrollment checks.

## Setup
```bash
npm install
cp .env.example .env
# DATABASE_URL=postgresql://...
# AUTH_SECRET=generate-a-long-random-secret
# NEXT_PUBLIC_APP_URL=https://your-domain.com
npx prisma generate
npm run db:migrate:deploy
npm run db:seed
npm run dev
```

Demo student: `01000000000` / `Demo1234!`
Demo admin: `01200000000` / `Admin1234!`
Demo teacher: `01100000000` / `Demo1234!`

## Production requirements
- Real managed PostgreSQL with backups.
- HTTPS and secure secret management.
- Real payment gateway adapter with webhook signature verification before accepting production payments.
- Object storage with signed URLs for assignment files.
- Google OAuth/YouTube API credentials if direct uploads are enabled.
- For stronger video protection, use a provider supporting signed playback/DRM rather than relying on YouTube Unlisted alone.
- External rate limiting (Redis/edge/WAF) for multi-instance deployments; the included limiter is a single-process safety net.
- Run database migrations through a controlled CI/CD process.


## V14 production hardening
Encrypted YouTube tokens, payment webhook retry safety, refund closure, production env validation, and a complete initial PostgreSQL migration baseline are included.
