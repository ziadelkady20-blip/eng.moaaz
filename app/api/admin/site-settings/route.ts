import { NextResponse } from 'next/server'
import { z } from 'zod'
import { requireSuperAdmin } from '@/lib/admin-access'
import { db } from '@/lib/db'
import { DEFAULT_SITE_SETTINGS, getSiteSettings, type SiteSettings } from '@/lib/site-settings'

const schema = z.object({
  brandName: z.string().trim().min(2).max(80),
  siteName: z.string().trim().min(2).max(120),
  announcement: z.string().max(240),
  heroBadge: z.string().max(120),
  heroTitle: z.string().min(4).max(180),
  heroDescription: z.string().max(500),
  heroPrimaryLabel: z.string().min(2).max(60),
  heroPrimaryUrl: z.string().min(1).max(300),
  heroSecondaryLabel: z.string().min(2).max(60),
  heroSecondaryUrl: z.string().min(1).max(300),
  footerText: z.string().max(180),
  supportPhone: z.string().max(30),
  whatsapp: z.string().max(30),
  seoTitle: z.string().min(4).max(180),
  seoDescription: z.string().max(300),
})

export async function GET() {
  try {
    await requireSuperAdmin()
    return NextResponse.json({ site: await getSiteSettings() })
  } catch {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
  }
}

export async function PUT(req: Request) {
  try {
    const admin = await requireSuperAdmin()
    const body = schema.parse(await req.json())
    const data: SiteSettings = { ...DEFAULT_SITE_SETTINGS, ...body }
    const site = await db.siteSetting.upsert({
      where: { id: 'site' },
      create: { id: 'site', data, updatedById: admin.id },
      update: { data, updatedById: admin.id },
    })
    await db.auditLog.create({
      data: {
        actorId: admin.id,
        action: 'UPDATE_SITE_SETTINGS',
        entity: 'SITE_SETTING',
        entityId: site.id,
        metadata: JSON.stringify({ keys: Object.keys(data) }),
      },
    })
    return NextResponse.json({ ok: true, site: data })
  } catch (error) {
    return NextResponse.json({
      error: error instanceof z.ZodError ? 'بيانات إعدادات الموقع غير صحيحة' : 'تعذر حفظ إعدادات الموقع',
    }, { status: 400 })
  }
}
