import type { MetadataRoute } from 'next'
import { db } from '@/lib/db'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://eng-moaaz.vercel.app').replace(/\/$/, '')
  const now = new Date()
  const routes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now },
    { url: `${base}/login`, lastModified: now },
    { url: `${base}/register`, lastModified: now },
  ]

  try {
    const courses = await db.course.findMany({
      where: { published: true },
      select: { id: true, updatedAt: true },
    })
    routes.push(...courses.map((course) => ({
      url: `${base}/checkout/${course.id}`,
      lastModified: course.updatedAt,
    })))
  } catch {
    // The public sitemap remains available if the database is temporarily unavailable.
  }

  return routes
}
