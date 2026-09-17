'use client'
import {ReactNode,useEffect,useState} from 'react'
import Link from 'next/link'
import {usePathname,useRouter} from 'next/navigation'
import {LayoutDashboard,BookOpen,Wallet,Users,Settings,ShieldCheck,Globe,LogOut,Menu,X,ChevronLeft} from 'lucide-react'

const items=[['الرئيسية','/admin',LayoutDashboard],['الكورسات والفيديوهات','/admin/courses',BookOpen],['المدفوعات والحجوزات','/admin/payments',Wallet],['محفظة الطلاب','/admin/wallet',Wallet],['المستخدمون','/admin/users',Users],['الإعدادات','/admin/settings',Settings]] as const

export default function AdminShell({children}:{children:ReactNode}){
 const [open,setOpen]=useState(false)
 const [user,setUser]=useState<any>(null)
 const router=useRouter(); const pathname=usePathname()
 useEffect(()=>{fetch('/api/auth/me',{cache:'no-store'}).then(r=>r.ok?r.json():Promise.reject()).then(d=>{if(d.user?.role!=='ADMIN')throw new Error();setUser(d.user)}).catch(()=>router.replace('/login'))},[router])
 useEffect(()=>setOpen(false),[pathname])
 async function logout(){await fetch('/api/auth/logout',{method:'POST'});router.replace('/login')}
 const isActive=(href:string)=>href==='/admin'?pathname==='/admin':pathname.startsWith(href)
 return <main className="min-h-screen bg-[var(--bg)] admin-shell">
  <style>{`
   .admin-shell{direction:rtl;color:var(--ink)}
   .admin-topbar{height:72px;position:sticky;top:0;z-index:50;background:rgba(255,255,255,.94);backdrop-filter:blur(18px);border-bottom:1px solid #ebe5f2;box-shadow:0 6px 22px rgba(55,28,78,.06)}
   .admin-topbar-inner{height:100%;width:min(1450px,calc(100% - 40px));margin:auto;display:flex;align-items:center;justify-content:space-between;gap:18px}
   .admin-brand{display:flex;align-items:center;gap:12px;min-width:0}.admin-brand-logo{width:46px;height:46px;object-fit:contain;border-radius:14px;border:1px solid #eadff2;background:#fff;box-shadow:0 6px 16px rgba(75,30,105,.10)}
   .admin-brand-title{font-weight:950;font-size:14px;color:#30233d;white-space:nowrap}.admin-brand-sub{font-size:10px;color:#8a8192;margin-top:3px;font-weight:700}
   .admin-user{display:flex;align-items:center;gap:10px}.admin-avatar{width:38px;height:38px;border-radius:12px;background:linear-gradient(145deg,#6d2fa3,#8d52c0);color:#fff;display:grid;place-items:center;font-weight:950;font-size:14px;box-shadow:0 7px 16px rgba(109,47,163,.18)}
   .admin-user-name{font-size:12px;font-weight:900;color:#332a3d}.admin-user-role{font-size:9px;color:#918798;margin-top:2px}.admin-menu-btn{display:none}
   .admin-layout{width:min(1450px,calc(100% - 40px));margin:auto;display:grid;grid-template-columns:250px minmax(0,1fr);gap:22px;padding:22px 0 35px}
   .admin-sidebar{position:sticky;top:94px;height:calc(100vh - 116px);align-self:start}.admin-nav{height:100%;display:flex;flex-direction:column;background:#fff;border:1px solid #ebe5f2;border-radius:24px;padding:12px;box-shadow:0 12px 30px rgba(48,25,67,.06);overflow:auto}
   .admin-nav-label{font-size:10px;color:#9b91a4;font-weight:950;padding:10px 12px 8px}.admin-nav-link{display:flex;align-items:center;gap:11px;min-height:46px;border-radius:14px;padding:0 13px;color:#5e5668;font-size:12px;font-weight:850;transition:.18s;margin-bottom:3px}.admin-nav-link svg{flex:0 0 18px}.admin-nav-link:hover{background:#f6f0fa;color:#6d2fa3;transform:translateX(-2px)}.admin-nav-link.active{background:linear-gradient(90deg,#f1e7f9,#f8f4fb);color:#6d2fa3;box-shadow:inset -3px 0 0 #6d2fa3}.admin-nav-link .nav-arrow{margin-right:auto;opacity:0;transition:.18s}.admin-nav-link.active .nav-arrow{opacity:1}
   .admin-divider{height:1px;background:#eee9f3;margin:9px 7px}.admin-special{color:#6d2fa3!important;background:#fbf8fd}.admin-special:hover{background:#f3eafb}
   .admin-content{min-width:0}.admin-mobile-title{display:none}
   @media(max-width:900px){.admin-topbar-inner,.admin-layout{width:min(100% - 24px,1450px)}.admin-menu-btn{display:grid;place-items:center;width:42px;height:42px;border:1px solid #e8e1ee;border-radius:13px;background:#fff;color:#6d2fa3}.admin-brand{margin-right:auto;margin-left:auto}.admin-user-name,.admin-user-role{display:none}.admin-layout{display:block;padding-top:14px}.admin-sidebar{position:fixed;inset:0;top:72px;height:auto;z-index:45;background:rgba(36,24,48,.28);backdrop-filter:blur(3px);padding:12px}.admin-nav{width:min(330px,88vw);height:calc(100vh - 96px);box-shadow:0 24px 55px rgba(31,17,43,.22)}.admin-sidebar.closed{display:none}.admin-sidebar.open{display:block}.admin-content{width:100%}}
   @media(max-width:520px){.admin-topbar{height:64px}.admin-topbar-inner{width:calc(100% - 18px)}.admin-brand-logo{width:40px;height:40px}.admin-brand-title{font-size:11px}.admin-brand-sub{font-size:8px}.admin-layout{width:calc(100% - 18px);padding-top:10px}}
  `}</style>
  <header className="admin-topbar">
   <div className="admin-topbar-inner">
    <button className="admin-menu-btn" aria-label="فتح القائمة" onClick={()=>setOpen(v=>!v)}>{open?<X size={19}/>:<Menu size={19}/>}</button>
    <div className="admin-brand"><img src="/brand-logo.png" className="admin-brand-logo"/><div><div className="admin-brand-title">لوحة إدارة Eng Moaaz Ismail</div><div className="admin-brand-sub">مركز التحكم بالمنصة التعليمية</div></div></div>
    <div className="admin-user"><div className="text-right"><div className="admin-user-name">{user?.name||'مدير النظام'}</div><div className="admin-user-role">{user?.isSuperAdmin?'SUPER ADMIN':'ADMIN'}</div></div><div className="admin-avatar">{(user?.name||'A').slice(0,1)}</div><button onClick={logout} className="btn btn-soft !rounded-xl" title="تسجيل الخروج"><LogOut size={16}/></button></div>
   </div>
  </header>
  <div className="admin-layout">
   <aside className={`admin-sidebar ${open?'open':'closed lg:block'}`}><nav className="admin-nav"><div className="admin-nav-label">إدارة المنصة</div>{items.map(([t,h,Icon])=><Link key={h} href={h} className={`admin-nav-link ${isActive(h)?'active':''}`}><Icon size={18}/><span>{t}</span><ChevronLeft className="nav-arrow" size={14}/></Link>)}{user?.isSuperAdmin&&<><div className="admin-divider"/><div className="admin-nav-label">إدارة متقدمة</div><Link href="/admin/team" className={`admin-nav-link admin-special ${isActive('/admin/team')?'active':''}`}><ShieldCheck size={18}/><span>المشرفون والصلاحيات</span><ChevronLeft className="nav-arrow" size={14}/></Link><Link href="/admin/website" className={`admin-nav-link admin-special ${isActive('/admin/website')?'active':''}`}><Globe size={18}/><span>التحكم الكامل بالموقع</span><ChevronLeft className="nav-arrow" size={14}/></Link></>}</nav></aside>
   <section className="admin-content">{children}</section>
  </div>
 </main>
}