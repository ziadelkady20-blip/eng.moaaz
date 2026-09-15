# V14 Production Hardening

- Added encrypted YouTube refresh-token storage with backward-compatible read fallback.
- Fixed payment webhook retry semantics: failed processing is not permanently deduplicated.
- Added production environment validation.
- Added refund subscription closure, notification, and audit logging.
- Added a complete initial PostgreSQL migration baseline so `prisma migrate deploy` can build a new database.
- Added Course↔Coupon relation in Prisma schema.

## Verification limitation
This environment could not complete npm dependency installation, so `npm ci`, Prisma engine validation, TypeScript compilation, Next.js production build, and live PostgreSQL migration execution still must be run in CI/staging.
