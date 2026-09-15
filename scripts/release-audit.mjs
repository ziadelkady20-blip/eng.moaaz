import fs from 'node:fs'
import path from 'node:path'
const root = process.cwd()
const failures = []
const warnings = []
const required = [
  'package.json','.env.example','middleware.ts','next.config.ts',
  'prisma/schema.prisma','prisma/seed.ts','app/api/health/route.ts',
  'app/api/payments/webhook/route.ts','app/api/admin/payments/[id]/confirm/route.ts'
]
for (const f of required) if (!fs.existsSync(path.join(root,f))) failures.push(`MISSING ${f}`)
const env = fs.readFileSync(path.join(root,'.env.example'),'utf8')
for (const key of ['DATABASE_URL','AUTH_SECRET','PAYMENT_WEBHOOK_SECRET','NEXT_PUBLIC_APP_URL']) {
  if (!new RegExp(`^${key}=`, 'm').test(env)) failures.push(`ENV MISSING ${key}`)
}
const pkg = JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8'))
for (const script of ['build','db:migrate:deploy','db:generate','release:check']) {
  if (!pkg.scripts?.[script]) failures.push(`SCRIPT MISSING ${script}`)
}
if (!fs.existsSync(path.join(root,'package-lock.json'))) warnings.push('No package-lock.json: generate and commit one before production CI.')
const schema = fs.readFileSync(path.join(root,'prisma/schema.prisma'),'utf8')
for (const model of ['User','Student','Parent','Teacher','Course','Lesson','Exam','Assignment','Attendance','Order','Payment','Subscription','Invoice','PaymentWebhookEvent']) {
  if (!schema.includes(`model ${model}`)) failures.push(`SCHEMA MISSING ${model}`)
}
const envLower = env.toLowerCase()
if (envLower.includes('admin1234') || envLower.includes('demo1234')) failures.push('DEMO CREDENTIALS FOUND IN ENV EXAMPLE')
console.log(`Release audit: ${failures.length ? 'FAILED' : 'PASSED'}${warnings.length ? ` (${warnings.length} warning${warnings.length===1?'':'s'})` : ''}`)
for (const x of failures) console.error('FAIL:',x)
for (const x of warnings) console.warn('WARN:',x)
process.exitCode = failures.length ? 1 : 0
