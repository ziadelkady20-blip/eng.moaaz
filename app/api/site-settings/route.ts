import { NextResponse } from 'next/server'
import { getSiteSettings } from '@/lib/site-settings'

export async function GET() {
  const s = await getSiteSettings()
  return NextResponse.json({
    site: {
      brandName: s.brandName,
      siteName: s.siteName,
      announcement: s.announcement,
      heroBadge: s.heroBadge,
      heroTitle: s.heroTitle,
      heroDescription: s.heroDescription,
      heroPrimaryLabel: s.heroPrimaryLabel,
      heroPrimaryUrl: s.heroPrimaryUrl,
      heroSecondaryLabel: s.heroSecondaryLabel,
      heroSecondaryUrl: s.heroSecondaryUrl,
      footerText: s.footerText,
      supportPhone: s.supportPhone,
      whatsapp: s.whatsapp,
    },
  })
}
