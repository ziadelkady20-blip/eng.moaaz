'use client'
import {ReactNode,useEffect,useState} from 'react'; import Link from 'next/link'; import {useRouter} from 'next/navigation'; import {Bell,Home,BookOpen,ClipboardCheck,FileText,Library,CalendarCheck,BarChart3,User,MessageCircle,Menu,LogOut,House} from 'lucide-react'
const items=[['الرئيسية','/student',Home],['الكورسات','/student/courses',BookOpen],['الدروس','/student/lessons',FileText],['الامتحانات','/student/exams',ClipboardCheck],['الواجبات','/student/assignments',FileText],['الكتب','/student/books',Library],['الحضور','/student/attendance',CalendarCheck],['الدرجات','/student/grades',BarChart3],['التقارير','/student/analytics',BarChart3],['الإشعارات','/student/notifications',Bell],['الملف الشخصي','/student/profile',User],['الدعم','/student/support',MessageCircle]] as const

type Me={name:string;role:string;phone?:string}
type SiteSettings={brandName?:string;siteName?:string;announcement?:string}

export default function DashboardShell({children,title}:{children:ReactNode,title:string}){
  const [open,setOpen]=useState(false); const [user,setUser]=useState<Me|null>(null); const [site,setSite]=useState<SiteSettings>({}); const [checking,setChecking]=useState(true); const router=useRouter()
  useEffect(()=>{
    let active=true
    Promise.all([
      fetch('/api/auth/me',{cache:'no-store'}).then(async r=>r.ok?r.json():Promise.reject()),
      fetch('/api/site-settings',{cache:'no-store'}).then(async r=>r.ok?r.json():({settings:{}})).catch(()=>({settings:{}})),
    ]).then(([me,settings])=>{if(!active)return; if(me.user?.role!=='STUDENT')throw new Error(); setUser(me.user); setSite(settings.settings??{})}).catch(()=>{if(active)router.replace('/login')}).finally(()=>{if(active)setChecking(false)})
    return()=>{active=false}
  },[router])
  async function logout(){await fetch('/api/auth/logout',{method:'POST'});router.replace('/login')}
  if(checking)return <main className="min-h-screen landing-page grid place-items-center"><div className="card p-8 muted font-bold">جاري تحميل حسابك...</div></main>
  const brand=site.brandName||'Eng Moaaz Ismail'; const siteName=site.siteName||'المنصة التعليمية'
  return <main className="min-h-screen landing-page pb-16">
    {site.announcement&&<div className="site-announcement">{site.announcement}</div>}
    <header className="site-header"><div className="site-header-inner">
      <div className="header-brand"><Link href="/student" className="brand-lockup"><img src="/logo.png" className="brand-logo" alt={`شعار ${brand}`}/><div><div className="font-black text-lg text-[var(--primary)]">{brand}</div><div className="text-xs muted">{siteName}</div></div></Link></div>
      <nav className="main-nav hidden lg:flex"><Link href="/">الرئيسية</Link><Link href="/student/courses" className="active">الكورسات</Link><Link href="/student/lessons">الدروس</Link><Link href="/student/exams">الامتحانات</Link></nav>
      <div className="header-actions">
        <button aria-label="فتح القائمة" className="theme-toggle lg:hidden" onClick={()=>setOpen(!open)}><Menu size={18}/></button>
        <Link href="/student/notifications" className="header-login"><Bell size={17}/><span className="hidden sm:inline">الإشعارات</span></Link>
        <button onClick={logout} className="header-register"><LogOut size={17}/><span>خروج</span></button>
        <div className="w-10 h-10 rounded-full bg-[#f0e7fb] text-[var(--primary)] grid place-items-center font-black border border-[#e4d6f0]">{user?.name?.[0]||'ط'}</div>
      </div>
    </div></header>
    <div className="container flex gap-6 py-8">
      {open&&<button aria-label="إغلاق القائمة" className="fixed inset-0 z-20 bg-black/20 lg:hidden" onClick={()=>setOpen(false)}/>} 
      <aside className={`${open?'block fixed right-4 left-4 top-24 z-30':'hidden'} lg:block w-64 shrink-0`}><div className="card p-4 lg:sticky lg:top-24">
        <div className="flex items-center justify-between px-3 pb-4 border-b border-[var(--line)]"><div><div className="text-xs muted font-bold">مساحة الطالب</div><div className="text-2xl font-black text-[var(--primary)]">{title}</div></div><House size={20} className="text-[var(--primary)]"/></div>
        <div className="pt-3">{items.map(([t,h,Icon])=><Link onClick={()=>setOpen(false)} key={h} href={h} className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-[var(--primary-soft)] font-semibold transition"><Icon size={18}/>{t}</Link>)}</div>
      </div></aside>
      <section className="flex-1 min-w-0">{children}</section>
    </div>
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-t grid grid-cols-4 p-2 shadow-[0_-8px_24px_rgba(45,25,65,.06)]">{items.slice(0,4).map(([t,h,Icon])=><Link key={h} href={h} className="grid place-items-center text-xs gap-1 py-1 font-bold text-[var(--ink)]"><Icon size={18}/><span>{t}</span></Link>)}</nav>
  </main>
}
