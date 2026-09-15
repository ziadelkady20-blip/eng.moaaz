# Eng Moaaz Ismail — Production Completion Checklist

## Implemented in V11
- Centers, groups and schedules data model + APIs
- Support conversations/messages data model + APIs
- Subscription and invoice data model
- Payment confirmation creates enrollment + subscription + invoice + notification atomically
- Signed payment webhook endpoint with idempotent enrollment/subscription upsert
- Audit log model and audit records for sensitive admin operations added here
- Clean `.env.example`
- Prisma migration commands and CI build/validation workflow

## Required before opening sales
1. Generate and review a Prisma migration in a real PostgreSQL staging DB. Production must use `prisma migrate deploy`, not `db push`. See Prisma deployment guidance.
2. Configure a real payment gateway and replace the generic webhook payload with that provider's documented signed webhook contract.
3. Configure Google Cloud OAuth, YouTube Data API, consent screen and production redirect URI. Complete any required Google/YouTube audit before relying on non-private uploads.
4. Configure object storage for assignment/profile/file uploads. Do not accept arbitrary user-provided file URLs in production.
5. Set HTTPS, secure cookies, AUTH_SECRET, payment webhook secret and all production secrets in the hosting provider.
6. Run CI build against production-like environment variables and a staging database.
7. Run end-to-end tests for register/login, permissions, purchase/confirmation/webhook, content access, exams, assignments, attendance, parent/teacher/admin workflows.
8. Add database backups, monitoring, error tracking and alerting.
9. Perform a manual mobile/RTL accessibility pass on real devices.
