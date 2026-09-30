'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { LayoutDashboard, LogOut, Menu, X, Search, Moon } from 'lucide-react'

const nav = [
  ['الرئيسية', '/'],
  ['المراحل', '/#stages'],
  ['الكورسات', '/student/courses'],
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
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/'
  const [user,setUser]=useState<{name?:string;role?:string}|null>(null)
  const [menu,setMenu]=useState(false)

  useEffect(()=>{
    if(pathname!=='/')return
    let cancelled=false
    fetch('/api/auth/me',{cache:'no-store'}).then(async r=>r.ok?r.json():null).then(d=>{if(!cancelled)setUser(d?.user??null)}).catch(()=>{if(!cancelled)setUser(null)})
    return()=>{cancelled=true}
  },[pathname])

  if(pathname!=='/')return null

  async function logout(){
    await fetch('/api/auth/logout',{method:'POST'})
    setUser(null)
    window.location.reload()
  }

  return <>
    <style>{`.home-auth-header{position:fixed;top:12px;left:0;right:0;z-index:80;height:64px}.home-auth-inner{width:min(1360px,calc(100% - 32px));height:100%;margin:auto;display:flex;align-items:center;justify-content:space-between;gap:18px;padding:0 12px 0 14px;border:1px solid #e6e1d8;background:rgba(255,253,248,.97);border-radius:999px;box-shadow:0 8px 24px rgba(23,36,58,.08);backdrop-filter:blur(16px)}.home-auth-brand{display:flex;align-items:center;min-width:190px}.home-auth-brand img{width:50px;height:50px;object-fit:contain;display:block}.home-auth-nav{display:flex;align-items:center;gap:30px}.home-auth-nav a{font-size:14px;font-weight:900;color:#26334a;white-space:nowrap;position:relative}.home-auth-nav a:not(:last-child):after{content:"";width:4px;height:4px;border-radius:50%;background:#ed7b0b;position:absolute;right:-16px;top:8px}.home-auth-nav a:hover{color:#e97908}.home-auth-actions{display:flex;align-items:center;gap:7px;min-width:300px;justify-content:flex-start}.home-auth-action{height:40px;padding:0 15px;border-radius:12px;font-weight:900;display:inline-flex;align-items:center;gap:7px}.home-auth-login{background:transparent;color:#26334a}.home-auth-register{background:#ed7b0b;color:#fff;border-radius:999px;padding-inline:20px;box-shadow:0 8px 18px rgba(237,123,11,.18)}.home-auth-user{display:inline-flex;align-items:center;gap:8px;color:#26334a;font-size:12px;font-weight:900}.home-auth-avatar{width:36px;height:36px;border-radius:50%;display:grid;place-items:center;background:#17243a;color:#fff;font-weight:950}.home-auth-tools{display:flex;align-items:center;gap:6px}.home-auth-tool{width:38px;height:38px;border:1px solid #e4dfd6;background:#fff;border-radius:50%;display:grid;place-items:center;color:#566071}.home-auth-mobile{display:none}@media(max-width:900px){.home-auth-nav,.home-auth-actions{display:none}.home-auth-inner{width:calc(100% - 22px)}.home-auth-brand{min-width:auto}.home-auth-brand img{width:46px;height:46px}.home-auth-mobile{display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;border:1px solid #e4dfd6;background:#fff;color:#17243a;border-radius:12px}.home-auth-mobile-menu{position:fixed;top:84px;right:10px;left:10px;background:#fffdf8;border:1px solid #e7e2d9;border-radius:18px;box-shadow:0 18px 42px rgba(23,36,58,.14);padding:12px;display:flex;flex-direction:column;gap:5px}.home-auth-mobile-menu a,.home-auth-mobile-menu button{height:44px;padding:0 14px;border-radius:11px;display:flex;align-items:center;gap:9px;border:0;background:transparent;font:inherit;font-weight:900;color:#26334a;text-align:right}.home-auth-mobile-menu a:hover,.home-auth-mobile-menu button:hover{background:#fff0d8;color:#d66e00}}`}</style>
    <header className="home-auth-header">
      <div className="home-auth-inner">
        <Link className="home-auth-brand" href="/" aria-label="الباشمهندس معاذ"><img src="/brand-logo-black.svg" alt="الباشمهندس معاذ"/></Link>
        <nav className="home-auth-nav" aria-label="التنقل الرئيسي">{nav.map(([label,href])=><Link key={href} href={href}>{label}</Link>)}</nav>
        <div className="home-auth-actions">
          <div className="home-auth-tools"><button className="home-auth-tool" aria-label="البحث"><Search size={16}/></button><button className="home-auth-tool" aria-label="الوضع"><Moon size={16}/></button></div>
          {user?<><span className="home-auth-user"><span className="home-auth-avatar">{user.name?.[0]||'ط'}</span>{user.name||'حسابك'}</span><Link className="home-auth-action home-auth-register" href={roleTarget(user.role)}><LayoutDashboard size={16}/> لوحة التحكم</Link><button className="home-auth-action home-auth-login" onClick={logout}><LogOut size={16}/> خروج</button></>:<><Link className="home-auth-action home-auth-login" href="/login">تسجيل الدخول</Link><Link className="home-auth-action home-auth-register" href="/register">اعمل حساب</Link></>}
        </div>
        <button className="home-auth-mobile" aria-label="فتح القائمة" onClick={()=>setMenu(v=>!v)}>{menu?<X size={20}/>:<Menu size={20}/>}</button>
      </div>
      {menu&&<div className="home-auth-mobile-menu">{nav.map(([label,href])=><Link key={href} href={href} onClick={()=>setMenu(false)}>{label}</Link>)}{user?<><Link href={roleTarget(user.role)} onClick={()=>setMenu(false)}><LayoutDashboard size={17}/> لوحة التحكم</Link><button onClick={async()=>{setMenu(false);await logout()}}><LogOut size={17}/> خروج</button></>:<><Link href="/login" onClick={()=>setMenu(false)}>تسجيل الدخول</Link><Link href="/register" onClick={()=>setMenu(false)}>اعمل حساب</Link></>}</div>}
    </header>
  </>
}
