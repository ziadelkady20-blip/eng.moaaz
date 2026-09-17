'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, LogOut, Menu, X } from 'lucide-react'

const nav = [
  ['الرئيسية', '/'],
  ['المراحل', '/#stages'],
  ['مميزات المنصة', '/#features'],
  ['عن المنصة', '/#about'],
] as const

function roleTarget(role?: string) {
  if (role === 'ADMIN') return '/admin'
  if (role === 'TEACHER') return '/teacher'
  if (role === 'PARENT') return '/parent'
  if (role === 'SUPPORT') return '/support'
  return '/student'
}

export default function HomeAuthHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<{ name?: string; role?: string } | null>(null)
  const [menu, setMenu] = useState(false)

  useEffect(() => {
    if (pathname !== '/') return
    let cancelled = false
    fetch('/api/auth/me', { cache: 'no-store' })
      .then(async r => (r.ok ? r.json() : null))
      .then(d => {
        if (!cancelled) setUser(d?.user ?? null)
      })
      .catch(() => {
        if (!cancelled) setUser(null)
      })
    return () => { cancelled = true }
  }, [pathname])

  if (pathname !== '/') return null

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    router.refresh()
  }

  return (
    <>
      <style>{`body:has(.home-auth-header) .site-header{display:none!important}.home-auth-header{position:fixed;top:0;left:0;right:0;z-index:80;height:78px;background:rgba(255,255,255,.97);border-bottom:1px solid #eee8f4;box-shadow:0 8px 26px rgba(42,24,65,.08);backdrop-filter:blur(16px)}.home-auth-inner{width:min(1360px,calc(100% - 32px));height:100%;margin:auto;display:flex;align-items:center;justify-content:space-between;gap:18px}.home-auth-brand{display:flex;align-items:center;min-width:54px}.home-auth-brand img{width:58px;height:58px;object-fit:contain;display:block}.home-auth-brand strong,.home-auth-brand span{display:none}.home-auth-nav{display:flex;align-items:center;gap:26px}.home-auth-nav a{font-size:14px;font-weight:900;color:#30263d;white-space:nowrap}.home-auth-nav a:hover{color:#000}.home-auth-actions{display:flex;align-items:center;gap:8px;min-width:230px;justify-content:flex-end}.home-auth-action{height:42px;padding:0 16px;border-radius:12px;font-weight:900;display:inline-flex;align-items:center;gap:8px}.home-auth-login{background:transparent;color:#30263d}.home-auth-register{background:#000;color:#fff;border-radius:999px;padding-inline:20px}.home-auth-user{display:inline-flex;align-items:center;gap:8px;color:#30263d;font-size:13px;font-weight:900}.home-auth-avatar{width:38px;height:38px;border-radius:50%;display:grid;place-items:center;background:#f0f0f0;color:#000;font-weight:950}.home-auth-mobile{display:none}.home-auth-mobile-menu{display:none}@media(max-width:900px){.home-auth-nav,.home-auth-actions{display:none}.home-auth-inner{width:calc(100% - 22px)}.home-auth-brand img{width:52px;height:52px}.home-auth-mobile{display:inline-flex;align-items:center;justify-content:center;width:42px;height:42px;border:1px solid #ddd;background:#fff;color:#000;border-radius:12px}.home-auth-mobile-menu{position:fixed;top:78px;right:10px;left:10px;background:#fff;border:1px solid #eee;border-radius:18px;box-shadow:0 18px 42px rgba(0,0,0,.15);padding:12px;display:flex;flex-direction:column;gap:5px}.home-auth-mobile-menu a,.home-auth-mobile-menu button{height:44px;padding:0 14px;border-radius:11px;display:flex;align-items:center;gap:9px;border:0;background:transparent;font:inherit;font-weight:900;color:#222;text-align:right}.home-auth-mobile-menu a:hover,.home-auth-mobile-menu button:hover{background:#f2f2f2;color:#000}}`}</style>
      <header className="home-auth-header">
        <div className="home-auth-inner">
          <Link className="home-auth-brand" href="/" aria-label="برمجها مع معاذ"><img src="/brand-logo-black.svg" alt="برمجها مع معاذ" /></Link>
          <nav className="home-auth-nav" aria-label="التنقل الرئيسي">{nav.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</nav>
          <div className="home-auth-actions">
            {user ? <><span className="home-auth-user"><span className="home-auth-avatar">{user.name?.[0] || 'ط'}</span>{user.name || 'حسابك'}</span><Link className="home-auth-action home-auth-register" href={roleTarget(user.role)}><LayoutDashboard size={16}/> لوحة التحكم</Link><button className="home-auth-action home-auth-login" onClick={logout}><LogOut size={16}/> خروج</button></> : <><Link className="home-auth-action home-auth-login" href="/login">تسجيل الدخول</Link><Link className="home-auth-action home-auth-register" href="/register">إنشاء حساب</Link></>}
          </div>
          <button className="home-auth-mobile" aria-label="فتح القائمة" onClick={() => setMenu(v => !v)}>{menu ? <X size={20}/> : <Menu size={20}/>}</button>
        </div>
        {menu && <div className="home-auth-mobile-menu">{nav.map(([label, href]) => <Link key={href} href={href} onClick={() => setMenu(false)}>{label}</Link>)}{user ? <><Link href={roleTarget(user.role)} onClick={() => setMenu(false)}><LayoutDashboard size={17}/> لوحة التحكم</Link><button onClick={async () => { setMenu(false); await logout() }}><LogOut size={17}/> خروج</button></> : <><Link href="/login" onClick={() => setMenu(false)}>تسجيل الدخول</Link><Link href="/register" onClick={() => setMenu(false)}>إنشاء حساب</Link></>}</div>}
      </header>
    </>
  )
}
