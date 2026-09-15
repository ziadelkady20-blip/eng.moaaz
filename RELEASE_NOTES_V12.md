# Eng Moaaz Ismail — V12 Release Hardening

V12 closes release blockers found during the V11 audit:
- deterministic Prisma migration for payment webhook idempotency
- signed webhook + event deduplication
- invoice/notification activation on paid webhook
- real teacher course creation page
- checkout link from course cards
- password recovery UX placeholder explicitly marked until OTP provider is connected
- YouTube upload file validation and streaming to temporary storage
- clean production environment template
- static release-check script

## Required before public launch
1. Provision managed PostgreSQL and run `npm run db:migrate:deploy`.
2. Set strong `AUTH_SECRET` and `PAYMENT_WEBHOOK_SECRET`.
3. Configure Google OAuth/YouTube API and production callback.
4. Connect a real Egyptian payment gateway and configure signed webhooks.
5. Configure object storage for assignment uploads (the current DB model is ready; provider integration remains deployment-specific).
6. Run `npm ci && npm run db:generate && npm run release:check && npm run build` in CI.
7. Run end-to-end tests against staging before accepting real payments.
