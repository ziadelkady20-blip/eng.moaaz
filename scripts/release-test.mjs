import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const required = [
  'package.json','prisma/schema.prisma','.env.example','middleware.ts',
  'app/api/auth/login/route.ts','app/api/auth/register/route.ts',
  'app/api/payments/webhook/route.ts','app/api/admin/youtube/upload/route.ts',
  'app/api/admin/payments/[id]/confirm/route.ts',
]
const failures=[]
for (const file of required) if (!fs.existsSync(path.join(root,file))) failures.push(`Missing ${file}`)
const env=fs.readFileSync(path.join(root,'.env.example'),'utf8')
for (const key of ['DATABASE_URL','AUTH_SECRET','PAYMENT_WEBHOOK_SECRET','TOKEN_ENCRYPTION_KEY','GOOGLE_YOUTUBE_CLIENT_ID','GOOGLE_YOUTUBE_CLIENT_SECRET','GOOGLE_YOUTUBE_REDIRECT_URI']) {
  if (!env.includes(key)) failures.push(`Missing env key ${key}`)
}
const upload=fs.readFileSync(path.join(root,'app/api/admin/youtube/upload/route.ts'),'utf8')
for (const needle of ["requireRole(['ADMIN'])",'decryptSecretOrPlain','youtube.videos.insert','file.size>MAX']) {
  if (!upload.includes(needle)) failures.push(`YouTube upload control missing: ${needle}`)
}
const webhook=fs.readFileSync(path.join(root,'app/api/payments/webhook/route.ts'),'utf8')
for (const needle of ['x-payment-signature','timingSafeEqual','paymentWebhookEvent','upsert({ where: { studentId_courseId']) {
  if (!webhook.includes(needle)) failures.push(`Payment webhook control missing: ${needle}`)
}
const schema=fs.readFileSync(path.join(root,'prisma/schema.prisma'),'utf8')
for (const model of ['Center','CenterGroup','Schedule','SupportConversation','Subscription','Invoice','AuditLog','PaymentWebhookEvent']) {
  if (!schema.includes(`model ${model}`)) failures.push(`Schema model missing: ${model}`)
}
if (failures.length) { console.error('Release test FAILED'); failures.forEach(x=>console.error('- '+x)); process.exit(1) }
console.log('Release test PASSED')
