import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://eng-moaaz.vercel.app').replace(/\/$/, '')
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/student/', '/parent/', '/teacher/', '/admin/', '/api/', '/checkout/'],
    },
    sitemap: `${base}/sitemap.xml`,
  }
}
