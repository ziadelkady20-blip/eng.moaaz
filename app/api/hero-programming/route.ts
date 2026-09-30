import { NextResponse } from 'next/server'

const IMAGE = `__IMAGE_BASE64__`

export const dynamic = 'force-static'

export function GET() {
  return new NextResponse(Buffer.from(IMAGE, 'base64'), {
    headers: {
      'Content-Type': 'image/webp',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
