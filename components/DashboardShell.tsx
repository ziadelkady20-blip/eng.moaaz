'use client'

import { ReactNode, useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { User, Wallet, BookOpen, FileText, ClipboardCheck, Home, Bell, Menu, X, LogOut, Search } from 'lucide-react'

const items = [
  ['الملف الشخصي','/student/profile',User],
  ['المحفظة','/student/wallet',Wallet],
  ['الكورسات','/student/courses',BookOpen],
  ['الدروس','/student/lessons',FileText],
  ['الامتحانات','/student/exams',ClipboardCheck],
  ['الواجبات','/student/assignments',FileText],
] as const

function LoadingShell(){
  return <main className="student-shell student-loading-shell" aria-busy="true">
    <header className="student-header"><div className="student-header-inner"><div className="student-skeleton student-skeleton-name"/><div className="student-skeleton student-skeleton-avatar"/></div></header>
    <div className="student-layout"><section className="student-content"><div className="student-skeleton student-skeleton-heading"/><div className="student-skeleton student-skeleton-text"/><div className="student-skeleton-grid">{Array.from({length:4}).map((_,i)=><div className="student-skeleton student-skeleton-stat" key={i}/>)}</div></section><aside className="student-sidebar"><div className="student-sidebar-card">{Array.from({length:6}).map((_,i)=><div className="student-skeleton student-skeleton-row" key={i}/>)}</div></aside></div>
  </main>
}

export default function DashboardShell({children,title}:{children:ReactNode;title:string}){
  const [open,setOpen]=useState(false)
  const [user,setUser]=useState<{id?:string;name?:string;role?:string;phone?:string}|null>(null)
  const [checking,setChecking]=useState(true)
  const router=useRouter()
  const pathname=usePathname()

  useEffect(()=>{
    let cancelled=false
    fetch('/api/auth/me',{cache:'no-store'})
      .then(async r=>r.ok?r.json():null)
      .then(d=>{if(cancelled)return;if(d?.user?.role!=='STUDENT')throw new Error('UNAUTHORIZED');setUser(d.user)})
      .catch(()=>{if(!cancelled)router.replace('/login')})
      .finally(()=>{if(!cancelled)setChecking(false)})
    return()=>{cancelled=true}
  },[router])

  useEffect(()=>setOpen(false),[pathname])

  async function logout(){
    await fetch('/api/auth/logout',{method:'POST'})
    router.replace('/login')
    router.refresh()
  }

  if(checking)return <LoadingShell/>
  if(!user)return null

  return <>
    <style>{`
      .student-shell{min-height:100vh;background:#f8f7f2;color:#17243a;padding-bottom:36px;font-family:'Rabie',Arial,'Noto Sans Arabic',sans-serif}
      .student-header{position:relative;z-index:60;height:72px;background:rgba(255,253,248,.98);border:1px solid #e7e2d9;border-radius:0 0 22px 22px;box-shadow:0 6px 20px rgba(23,36,58,.07);}
      .student-header-inner{height:100%;width:min(1360px,calc(100% - 42px));margin:auto;display:flex;direction:rtl;align-items:center;justify-content:space-between;gap:18px}
      .student-brand{display:flex;align-items:center;gap:10px;min-width:205px}.student-brand img{width:46px;height:46px;object-fit:contain;border-radius:12px}.student-brand strong{display:block;color:#17243a;font-size:16px;font-weight:950;white-space:nowrap}.student-brand span{display:block;color:#8b9099;font-size:10px;font-weight:800;margin-top:2px;white-space:nowrap}
      .student-top-nav{display:flex;align-items:center;gap:26px}.student-top-nav a{font-size:13px;font-weight:950;color:#27344a;position:relative}.student-top-nav a:hover,.student-top-nav a.active{color:#e97908}.student-top-nav a.active:after{content:"";position:absolute;bottom:-10px;right:0;left:0;height:2px;border-radius:999px;background:#e97908}
      .student-actions{display:flex;align-items:center;direction:ltr;gap:8px;min-width:205px;justify-content:flex-start}.student-action{height:40px;border:1px solid #e4dfd6;background:#fff;border-radius:999px;padding:0 13px;color:#354157;display:inline-flex;align-items:center;gap:7px;font-size:12px;font-weight:900}.student-action:hover{border-color:#f0c489;background:#fff8ed}.student-avatar{width:40px;height:40px;border-radius:50%;background:#17243a;color:#fff;display:grid;place-items:center;font-weight:950;border:2px solid #fff;box-shadow:0 3px 10px rgba(23,36,58,.14)}.student-menu-button{display:none}
      .student-layout{width:min(1360px,calc(100% - 42px));margin:auto;display:grid;grid-template-columns:minmax(0,1fr) 255px;gap:28px;padding:22px 0 0;direction:ltr}.student-sidebar{direction:rtl;grid-column:2;grid-row:1}.student-content{direction:rtl;min-width:0;grid-column:1;grid-row:1}
      .student-sidebar-card{background:#fffdf8;border:1px solid #e7e2d9;border-radius:20px;padding:10px;box-shadow:0 10px 28px rgba(23,36,58,.06);position:sticky;top:88px}.student-sidebar-title{padding:9px 12px 14px;border-bottom:1px solid #eee9df;margin-bottom:7px;color:#17243a;font-size:20px;font-weight:950}.student-sidebar a{display:flex;align-items:center;gap:10px;padding:11px 12px;border-radius:10px;color:#4f5968;font-size:13px;font-weight:850}.student-sidebar a:hover,.student-sidebar a.active{background:#fff0d8;color:#d66e00}.student-sidebar a.active{box-shadow:inset -3px 0 0 #ed7b0b}.student-sidebar a svg{color:#7d8795}.student-sidebar a.active svg{color:#ed7b0b}
      .student-logout{display:flex;align-items:center;gap:9px;width:100%;margin-top:9px;padding:11px 12px;border:0;border-top:1px solid #eee9df;background:transparent;color:#c85b4b;font:inherit;font-size:13px;font-weight:900;cursor:pointer;text-align:right}.student-logout:hover{background:#fff5f2;border-radius:10px}
      .student-mobile-menu{display:none}.student-mobile-bar{display:none}
      .student-loading-shell{background:#f8f7f2;min-height:100vh}.student-skeleton{position:relative;overflow:hidden;background:#ebe6dc;border-radius:12px}.student-skeleton:after{content:"";position:absolute;inset:0;transform:translateX(-100%);background:linear-gradient(90deg,transparent,rgba(255,255,255,.8),transparent);animation:studentShimmer 1.25s ease-in-out infinite}.student-skeleton-name{width:145px;height:14px}.student-skeleton-avatar{width:40px;height:40px;border-radius:50%}.student-skeleton-heading{width:310px;height:34px}.student-skeleton-text{width:480px;height:14px;margin-top:12px}.student-skeleton-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;margin-top:26px}.student-skeleton-stat{height:108px}.student-skeleton-row{height:42px;margin:6px 0}@keyframes studentShimmer{100%{transform:translateX(100%)}}
      @media(max-width:1000px){.student-top-nav{display:none}.student-brand{min-width:auto}.student-header-inner{width:calc(100% - 20px)}.student-layout{display:block;width:calc(100% - 20px);padding-top:14px}.student-sidebar{display:none}.student-content{display:block}.student-menu-button{display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;border:1px solid #e4dfd6;border-radius:10px;background:#fff;color:#e97908}.student-mobile-menu{position:fixed;top:82px;right:10px;left:10px;z-index:70;background:#fffdf8;border:1px solid #e7e2d9;border-radius:16px;box-shadow:0 18px 42px rgba(23,36,58,.14);padding:9px;display:flex;flex-direction:column;gap:3px;max-height:calc(100vh - 150px);overflow:auto}.student-mobile-menu a,.student-mobile-menu button{min-height:44px;padding:0 12px;border-radius:10px;display:flex;align-items:center;gap:10px;border:0;background:transparent;font:inherit;font-size:13px;font-weight:900;color:#4f5968;text-align:right}.student-mobile-menu a.active,.student-mobile-menu a:hover{background:#fff0d8;color:#d66e00}.student-mobile-menu button{color:#c85b4b}.student-shell{padding-bottom:24px}}
      @media(max-width:560px){.student-header{height:62px;border-radius:0 0 16px 16px}.student-brand img{width:38px;height:38px}.student-brand strong{font-size:14px}.student-brand span{display:none}.student-action{width:40px;height:40px;padding:0;justify-content:center}.student-action span{display:none}.student-avatar{width:38px;height:38px}.student-layout{width:calc(100% - 14px)}.student-skeleton-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.student-skeleton-stat{height:90px}}
    `}</style>
    <main className="student-shell">
      <header className="student-header">
        <div className="student-header-inner">
          <Link className="student-brand" href="/student"><img src="/logo.png" alt="الباشمهندس معاذ"/><div><strong>الباشمهندس معاذ</strong><span>منصة شرح مادة البرمجة</span></div></Link>
          <nav className="student-top-nav" aria-label="التنقل الرئيسي">
            <Link className={pathname==='/student'?'active':''} href="/student">الرئيسية</Link>
            <Link className={pathname.startsWith('/student/courses')?'active':''} href="/student/courses">الكورسات</Link>
            <Link className={pathname.startsWith('/student/lessons')?'active':''} href="/student/lessons">الدروس</Link>
            <Link className={pathname.startsWith('/student/exams')?'active':''} href="/student/exams">الامتحانات</Link>
          </nav>
          <div className="student-actions">
            <Link className="student-action" href="/"><Home size={16}/><span>الرئيسية</span></Link>
            <Link className="student-action" href="/student/notifications"><Bell size={16}/><span>الإشعارات</span></Link>
            <button className="student-menu-button" onClick={()=>setOpen(v=>!v)} aria-label="القائمة">{open?<X size={18}/>:<Menu size={18}/>}</button>
            <Link className="student-avatar" href="/student/profile">{user.name?.[0]||'ط'}</Link>
          </div>
        </div>
      </header>

      {open&&<><button aria-label="إغلاق القائمة" className="fixed inset-0 z-[65] bg-black/15" onClick={()=>setOpen(false)}/><div className="student-mobile-menu">{items.map(([label,href,Icon])=><Link key={href} className={pathname===href?'active':''} href={href} onClick={()=>setOpen(false)}><Icon size={17}/>{label}</Link>)}<button onClick={logout}><LogOut size={17}/> تسجيل الخروج</button></div></>}

      <div className="student-layout">
        <section className="student-content">{children}</section>
        <aside className="student-sidebar">
          <div className="student-sidebar-card">
            <div className="student-sidebar-title">{title}</div>
            {items.map(([label,href,Icon])=><Link key={href} className={pathname===href?'active':''} href={href}><Icon size={17}/>{label}</Link>)}
            <button className="student-logout" onClick={logout}><LogOut size={17}/> تسجيل الخروج</button>
          </div>
        </aside>
      </div>
    </main>
  </>
}
