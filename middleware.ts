import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const path=req.nextUrl.pathname
  if (path.startsWith('/api/')) return NextResponse.next()
  const protectedPrefixes=['/student','/parent','/teacher','/admin','/checkout']
  if (!protectedPrefixes.some(p=>path===p||path.startsWith(p+'/'))) return NextResponse.next()
  if (!req.cookies.get('taallum_session')?.value) {
    const url=req.nextUrl.clone(); url.pathname='/login'; url.searchParams.set('next',path); return NextResponse.redirect(url)
  }
  return NextResponse.next()
}
export const config={matcher:['/((?!_next/static|_next/image|favicon.ico).*)']}
