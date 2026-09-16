# Production Deployment — Eng Moaaz Ismail

## Current backend wiring
The application now has persistent PostgreSQL-backed site settings, a Super Admin website control center, public SEO metadata/sitemap, protected admin APIs, student registration, course visibility controls, orders/payments/enrollment, coupons, notifications and audit logging.

## Required services
- PostgreSQL 15+
- Node 20+
- HTTPS domain
- Google Cloud OAuth + YouTube Data API when YouTube integration is enabled
- A real Egyptian payment gateway with signed webhooks for automated payment confirmation
- Object storage for student uploads (do not store uploads in the application container)

## Environment
Copy `.env.example` to the hosting provider's environment settings and replace every placeholder. Never commit `.env`.

Required secrets:
- DATABASE_URL
- AUTH_SECRET
- PAYMENT_WEBHOOK_SECRET
- TOKEN_ENCRYPTION_KEY
- SUPER_ADMIN_PHONE
- NEXT_PUBLIC_SITE_URL

YouTube variables when enabled:
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
- GOOGLE_REDIRECT_URI

Generate independent high-entropy secrets for AUTH_SECRET, PAYMENT_WEBHOOK_SECRET and TOKEN_ENCRYPTION_KEY. `SUPER_ADMIN_PHONE` must match the phone number of the intended Super Admin account.

## Release sequence
```bash
npm install
npm run db:generate
npm run db:migrate:deploy
npm run lint
npm run build
npm run release:test
npm run release:audit
npm start
```

The Vercel build command is configured to run `prisma migrate deploy` before `next build`, so `DATABASE_URL` must be available during the production build.

## First deployment
Commit a lockfile before switching CI from `npm install` to `npm ci`. The repository should keep dependency installation reproducible for future releases.

## Payment go-live
The current checkout creates a pending order and payment record. Admin confirmation activates enrollment, subscription, invoice and notification atomically. The manual flow is retained as a fallback.

For automated payments, configure the gateway webhook to call `/api/payments/webhook`, use the shared signing secret, send a unique event id, and validate the exact order amount. Test retries and duplicate webhook delivery in staging.

## YouTube go-live
Configure the OAuth redirect URI exactly as registered in Google Cloud. Store the refresh token only through the encrypted `TOKEN_ENCRYPTION_KEY` mechanism. Use Unlisted/Private according to the chosen content policy; YouTube Unlisted is not DRM.

## Site control center
Super Admin only: `/admin/website`. Changes are stored in the `SiteSetting` PostgreSQL record and are consumed by the public homepage for branding/hero/footer values and by the SEO metadata layer. Admin accounts can be created from `/admin/team`; regular admins do not receive these governance controls.

## Uploads
The current YouTube upload endpoint uses a temporary filesystem file only as a transfer buffer. Student assignment uploads still require an object-storage adapter before accepting arbitrary student files in production.

## Final pre-launch checks
1. Confirm the database migration is applied successfully.
2. Confirm `SUPER_ADMIN_PHONE` points to the intended account.
3. Log in as Super Admin and edit/save website settings, then verify the public home page reflects them.
4. Test register → login → checkout → payment submission → Admin confirmation → student course access.
5. Test coupon validation, exam submission, assignment flow, attendance, parent/teacher/admin permissions and support.
6. Run the public `/api/health` endpoint and verify database connectivity.
7. Configure backups, monitoring and error tracking.
8. Complete a real mobile/RTL/accessibility pass before paid advertising.
