# V13 Release Candidate

V13 hardens payment webhook idempotency and adds a dependency-free release audit.

## Required before production
1. Generate and commit `package-lock.json` with the chosen Node/npm toolchain.
2. Run `npm ci` in CI.
3. Run `npm run db:generate`.
4. Run `npm run db:migrate:deploy` against staging PostgreSQL.
5. Run `npm run release:audit`.
6. Run `npm run lint` and `npm run build`.
7. Execute E2E tests against staging with sandbox payment and OAuth credentials.
8. Configure object storage with signed URLs for assignment files.
9. Configure YouTube OAuth and verify quota/upload restrictions.
10. Configure a real payment gateway adapter and verify signed webhooks and amounts.
11. Configure backups, monitoring, alerting, HTTPS, DNS and secret management.

This is a release candidate; external production services cannot be provisioned from this environment.
