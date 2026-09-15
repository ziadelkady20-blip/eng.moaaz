# Production migration plan

The schema now includes Centers/Groups/Schedules, Support, Subscriptions, Invoices, AuditLog and UploadedFile.

Generate the checked-in migration in a PostgreSQL development database with:

```bash
npx prisma migrate dev --name production_completion
```

Review the generated SQL, then commit it. Staging/production must use:

```bash
npx prisma migrate deploy
```

Prisma documents `migrate deploy` as the production/staging command and recommends running it through CI/CD. Do not use `db push` for production.
