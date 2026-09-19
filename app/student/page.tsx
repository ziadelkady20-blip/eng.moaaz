'use client'

import DashboardShell from '@/components/DashboardShell'
import Link from 'next/link'
import {BookOpen,CalendarCheck2,CheckCircle2,ChevronLeft,ClipboardCheck,GraduationCap,PlayCircle,RefreshCw,Trophy,WalletCards} from 'lucide-react'
import {useEffect,useState} from 'react'

const statCards=[
  {key:'avg',label:'متوسط الدرجات',icon:Trophy,suffix:'%'},
  {key:'attendance',label:'نسبة الحضور',icon:CalendarCheck2,suffix:'%'},
  {key:'courses',label:'الكورسات النشطة',icon:BookOpen,suffix:''},
  {key:'lessons',label:'دروس مكتملة',icon:CheckCircle2,suffix:''},
]

export default function Student(){
 const [d,setD]=useState<any>(),[error,setError]=useState(''),[loading,setLoading]=useState(true)
 async function load(){
  setLoading(true);setError('')
  try{
   const r=await fetch('/api/student/dashboard?ts='+Date.now(),{cache:'no-store'})
   const body=await r.json().catch(()=>({error:'استجابة غير صالحة من الخادم'}))
   if(!r.ok)throw new Error(body?.error||'تعذر تحميل لوحة الطالب')
   setD(body)
  }catch(e:any){setError(e.message||'تعذر تحميل لوحة الطالب')}finally{setLoading(false)}
 }
 useEffect(()=>{load()},[])
 if(error)return <DashboardShell title="لوحة الطالب"><div className="mx-auto w-full max-w-[1180px] rounded-[28px] border border-red-100 bg-white p-10 text-center shadow-[0_12px_35px_rgba(42,24,65,.05)]"><div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-red-50 text-red-500">!</div><h1 className="mt-4 text-xl font-black">حصل خطأ أثناء تحميل لوحة الطالب</h1><p className="mx-auto mt-2 max-w-lg text-sm leading-7 text-[#77717e]">{error}</p><button className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-3 text-sm font-black text-white" onClick={load}><RefreshCw size={16}/> حاول مرة أخرى</button></div></DashboardShell>
 if(loading||!d)return <DashboardShell title="لوحة الطالب"><div className="mx-auto w-full max-w-[1180px] space-y-5"><div className="h-48 animate-pulse rounded-[30px] bg-[#eee9f3]"/><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[1,2,3,4].map(i=><div key={i} className="h-28 animate-pulse rounded-2xl bg-[#f1edf4]"/>)}</div></div></DashboardShell>

 const firstName=d.student?.name?.split(' ')[0]||'طالبنا'
 const stats=d.stats||{}
 const continueLesson=d.continue?.[0]
 const courses=d.courses||[]
 const attempts=d.recentAttempts||[]

 return <DashboardShell title="لوحة الطالب"><div className="mx-auto w-full max-w-[1180px] space-y-6 pb-10">
  <section className="relative overflow-hidden rounded-[30px] bg-[linear-gradient(135deg,#432067_0%,#6d2fa3_55%,#8d54bd_100%)] px-6 py-7 text-white shadow-[0_18px_45px_rgba(109,47,163,.2)] md:px-8 md:py-8">
   <div className="absolute -left-12 -top-20 h-52 w-52 rounded-full bg-white/10 blur-3xl"/><div className="absolute -bottom-24 right-1/3 h-48 w-48 rounded-full bg-white/10 blur-3xl"/>
   <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between"><div><div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-black ring-1 ring-white/10"><GraduationCap size={15}/> لوحة التعلم</div><h1 className="text-3xl font-black tracking-tight md:text-4xl">صباح الخير يا {firstName} 👋</h1><p className="mt-2 max-w-2xl text-sm font-medium leading-7 text-white/80">كل تقدمك في مكان واحد — تابع دروسك، واجباتك ونتائجك بسهولة.</p></div><Link href="/student/courses" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3.5 text-sm font-black text-[#5c2889] shadow-lg transition hover:-translate-y-0.5">استكشف الكورسات <ChevronLeft size={17}/></Link></div>
  </section>

  <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
   {statCards.map(({key,label,icon:Icon,suffix})=>{const value=key==='avg'?stats.avg:key==='attendance'?stats.attendance:key==='courses'?stats.courses:`${stats.lessonsCompleted||0}/${stats.totalLessons||0}`;return <div key={key} className="group rounded-[22px] border border-[#eee8f4] bg-white p-5 shadow-[0_8px_25px_rgba(42,24,65,.045)] transition hover:-translate-y-0.5"><div className="flex items-center justify-between"><div className="grid h-10 w-10 place-items-center rounded-xl bg-[#f4ecfa] text-[var(--primary)]"><Icon size={18}/></div><span className="text-[11px] font-black text-[#96909d]">{label}</span></div><div className="mt-4 text-3xl font-black tracking-tight text-[#282235]">{value}{suffix}</div></div>})}
  </section>

  <div className="grid gap-5 lg:grid-cols-[1.25fr_.75fr]">
   <section className="overflow-hidden rounded-[26px] border border-[#eee8f4] bg-white shadow-[0_10px_30px_rgba(42,24,65,.05)]">
    <div className="flex items-center justify-between border-b border-[#f0ebf4] px-5 py-5 md:px-6"><div><h2 className="text-xl font-black">استكمل من حيث توقفت</h2><p className="mt-1 text-xs font-medium text-[#89818f]">ارجع لآخر درس كنت بتذاكره.</p></div>{continueLesson&&<PlayCircle className="text-[var(--primary)]" size={22}/>}</div>
    {continueLesson?<div className="p-5 md:p-6"><div className="relative overflow-hidden rounded-[22px] bg-[#faf6fd] p-5"><div className="absolute left-0 top-0 h-full w-1 bg-[var(--primary)]"/><div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><div className="min-w-0"><div className="text-xs font-black text-[var(--primary)]">{continueLesson.course}</div><h3 className="mt-1 truncate text-lg font-black">{continueLesson.title}</h3><div className="mt-1 text-xs font-bold text-[#85808c]">{Math.round(continueLesson.watchedPct)}% مشاهدة</div><div className="mt-3 h-2 max-w-md overflow-hidden rounded-full bg-[#e9e1ee]"><div className="h-full rounded-full bg-[var(--primary)]" style={{width:Math.min(100,Math.max(0,continueLesson.watchedPct))+'%'}}/></div></div><Link href={'/student/lessons/'+continueLesson.lessonId} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-3 text-xs font-black text-white">متابعة الدرس <PlayCircle size={15}/></Link></div></div></div>:<div className="grid min-h-[190px] place-items-center p-8 text-center"><div><div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#f4ecfa] text-[var(--primary)]"><PlayCircle size={25}/></div><h3 className="mt-3 font-black">لسه مفيش درس بدأت فيه</h3><p className="mt-1 text-xs leading-6 text-[#888190]">ابدأ أول درس من أحد الكورسات المسجلة عندك.</p><Link href="/student/courses" className="mt-4 inline-flex items-center gap-2 rounded-xl border border-[#e5dced] px-4 py-2.5 text-xs font-black text-[var(--primary)]">عرض الكورسات</Link></div></div>}
   </section>

   <section className="overflow-hidden rounded-[26px] border border-[#eee8f4] bg-white shadow-[0_10px_30px_rgba(42,24,65,.05)]"><div className="flex items-center justify-between border-b border-[#f0ebf4] px-5 py-5"><div><h2 className="text-xl font-black">آخر النتائج</h2><p className="mt-1 text-xs font-medium text-[#89818f]">أحدث نتائج اختباراتك.</p></div><Trophy className="text-[var(--primary)]" size={21}/></div><div className="p-4">{attempts.length?attempts.slice(0,4).map((a:any)=><div key={a.id} className="flex items-center gap-3 rounded-2xl p-3 transition hover:bg-[#faf7fd]"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#f4ecfa] text-[var(--primary)]"><Trophy size={16}/></div><div className="min-w-0 flex-1"><div className="truncate text-sm font-black">{a.exam?.title||'اختبار'}</div><div className="mt-1 text-[11px] text-[#8b8491]">نتيجة الاختبار</div></div><div className="text-lg font-black text-[var(--primary)]">{Math.round(a.score||0)}%</div></div>):<div className="grid min-h-[190px] place-items-center p-8 text-center"><div><div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#f4ecfa] text-[var(--primary)]"><Trophy size={24}/></div><h3 className="mt-3 font-black">لسه مفيش نتائج</h3><p className="mt-1 text-xs leading-6 text-[#888190]">نتائج اختباراتك هتظهر هنا بعد أول محاولة.</p></div></div>}</div></section>
  </div>

  <section><div className="mb-4 flex items-end justify-between"><div><h2 className="text-xl font-black md:text-2xl">كورساتك الحالية</h2><p className="mt-1 text-xs font-medium text-[#89818f]">تابع تقدمك في الكورسات المسجل فيها.</p></div><Link href="/student/courses" className="text-xs font-black text-[var(--primary)]">عرض الكل ←</Link></div>
   {courses.length?<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{courses.map((c:any)=><Link href={'/student/courses/'+c.id} key={c.id} className="group overflow-hidden rounded-[24px] border border-[#eee8f4] bg-white shadow-[0_8px_25px_rgba(42,24,65,.045)] transition hover:-translate-y-1 hover:shadow-[0_14px_35px_rgba(42,24,65,.08)]"><div className="relative h-32 overflow-hidden bg-[linear-gradient(135deg,#f3eafa,#fff)]">{c.coverUrl?<img src={c.coverUrl} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105"/>:<div className="grid h-full place-items-center text-[var(--primary)]"><BookOpen size={38}/></div>}<div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent"/><span className="absolute bottom-3 right-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-black text-[#5b287f]">مسجل</span></div><div className="p-4"><h3 className="truncate text-base font-black">{c.title}</h3><div className="mt-2 flex items-center justify-between text-xs font-bold text-[#89818f]"><span>{c.lessons||0} درس</span><span>{Math.round(c.progress||0)}%</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#eeeaf2]"><div className="h-full rounded-full bg-[var(--primary)]" style={{width:Math.min(100,Math.max(0,c.progress||0))+'%'}}/></div></div></Link>)}</div>:<div className="rounded-[24px] border border-dashed border-[#dcd3e5] bg-white p-10 text-center"><div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#f4ecfa] text-[var(--primary)]"><BookOpen size={25}/></div><h3 className="mt-3 font-black">لسه مفيش كورسات مسجلة</h3><p className="mt-1 text-xs leading-6 text-[#888190]">اختار كورس من القائمة وابدأ رحلتك التعليمية.</p><Link href="/student/courses" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-3 text-xs font-black text-white">استكشف الكورسات <ChevronLeft size={15}/></Link></div>}
  </section>

  <section className="grid gap-4 md:grid-cols-2"><Link href="/student/assignments" className="group flex items-center gap-4 rounded-[22px] border border-[#eee8f4] bg-white p-5 shadow-[0_8px_25px_rgba(42,24,65,.04)] transition hover:-translate-y-0.5"><div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#f4ecfa] text-[var(--primary)]"><ClipboardCheck size={19}/></div><div className="min-w-0 flex-1"><h3 className="font-black">الواجبات</h3><p className="mt-1 text-xs text-[#888190]">راجع واجباتك وسلّم الحلول المطلوبة.</p></div><ChevronLeft size={19} className="text-[#aaa2b0] transition group-hover:-translate-x-1"/></Link><Link href="/student/wallet" className="group flex items-center gap-4 rounded-[22px] border border-[#eee8f4] bg-white p-5 shadow-[0_8px_25px_rgba(42,24,65,.04)] transition hover:-translate-y-0.5"><div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#f4ecfa] text-[var(--primary)]"><WalletCards size={19}/></div><div className="min-w-0 flex-1"><h3 className="font-black">المحفظة</h3><p className="mt-1 text-xs text-[#888190]">تابع رصيدك وعمليات الشحن والشراء.</p></div><ChevronLeft size={19} className="text-[#aaa2b0] transition group-hover:-translate-x-1"/></Link></section>
 </div></DashboardShell>
}
