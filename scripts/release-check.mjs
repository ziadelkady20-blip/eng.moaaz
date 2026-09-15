import fs from 'node:fs'; import path from 'node:path';
const root=process.cwd(); const must=['package.json','.env.example','prisma/schema.prisma','app/api/health/route.ts','middleware.ts','next.config.ts'];
let fail=0; for(const f of must){if(!fs.existsSync(path.join(root,f))){console.error('MISSING',f);fail++}}
const schema=fs.readFileSync(path.join(root,'prisma/schema.prisma'),'utf8'); for(const m of ['Center','CenterGroup','Schedule','SupportConversation','Subscription','Invoice','UploadedFile','AuditLog','PaymentWebhookEvent']) if(!schema.includes(`model ${m}`)){console.error('SCHEMA MISSING',m);fail++}
const env=fs.readFileSync(path.join(root,'.env.example'),'utf8'); for(const k of ['DATABASE_URL','AUTH_SECRET','PAYMENT_WEBHOOK_SECRET']) if(!env.includes(k)){console.error('ENV MISSING',k);fail++}
const pkg=JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8')); for(const s of ['build','db:migrate:deploy','release:check']) if(!pkg.scripts?.[s]){console.error('SCRIPT MISSING',s);fail++}
console.log(fail?'Release check FAILED':'Release check PASSED (static checks only)'); process.exitCode=fail?1:0;
