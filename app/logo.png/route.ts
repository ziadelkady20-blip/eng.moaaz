export async function GET() {
  const response = await fetch('https://raw.githubusercontent.com/ziadelkady20-blip/eng.moaaz/main/logo.png', { cache: 'force-cache' })
  if (!response.ok) return new Response('Logo image not found', { status: 404 })
  return new Response(await response.arrayBuffer(), {
    headers: {
      'Content-Type': response.headers.get('content-type') || 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
