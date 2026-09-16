import { db } from '@/lib/db'

export type SiteSettings = {
  brandName: string
  siteName: string
  announcement: string
  heroBadge: string
  heroTitle: string
  heroDescription: string
  heroPrimaryLabel: string
  heroPrimaryUrl: string
  heroSecondaryLabel: string
  heroSecondaryUrl: string
  footerText: string
  supportPhone: string
  whatsapp: string
  seoTitle: string
  seoDescription: string
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  brandName: 'Eng Moaaz Ismail',
  siteName: 'المنصة التعليمية',
  announcement: '',
  heroBadge: 'منصة تعليمية متكاملة',
  heroTitle: 'تعلم صح، تابع تقدمك، وحقق هدفك',
  heroDescription: 'منصة تعليمية تجمع الشرح والفيديوهات والاختبارات والواجبات والمتابعة في مكان واحد.',
  heroPrimaryLabel: 'ابدأ الآن',
  heroPrimaryUrl: '/register',
  heroSecondaryLabel: 'استكشف الكورسات',
  heroSecondaryUrl: '#stages',
  footerText: '© Eng Moaaz Ismail 2026',
  supportPhone: '',
  whatsapp: '',
  seoTitle: 'Eng Moaaz Ismail | المنصة التعليمية',
  seoDescription: 'منصة Eng Moaaz Ismail التعليمية لطلاب المرحلة الثانوية.'
}

function normalize(value: unknown): Partial<SiteSettings> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {}
  const source = value as Record<string, unknown>
  const out: Record<string, string> = {}
  for (const key of Object.keys(DEFAULT_SITE_SETTINGS)) {
    if (typeof source[key] === 'string') out[key] = source[key] as string
  }
  return out as Partial<SiteSettings>
}

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const row = await db.siteSetting.findUnique({ where: { id: 'site' } })
    return { ...DEFAULT_SITE_SETTINGS, ...normalize(row?.data) }
  } catch {
    return DEFAULT_SITE_SETTINGS
  }
}
