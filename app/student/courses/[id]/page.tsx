'use client'
import DashboardShell from '@/components/DashboardShell'
import {useEffect,useState} from 'react'
import Link from 'next/link'
import {ArrowRight,BookOpen,CheckCircle2,ChevronDown,ChevronUp,ClipboardCheck,LockKeyhole,PlayCircle,WalletCards} from 'lucide-react'

export default function CoursePage({params}:{params:Promise<{id:string}>}){
 const [d,setD]=useState<any>(),[err,setErr]=useState(''),[busy,setBusy]=useState(false),[msg,setMsg]=useState(''),[open,setOpen]=useState<Record<string,boolean>>({})
 async function load(){
  try{
   const p=await params
   const r=await fetch('/api/student/courses/'+p.id+'?ts='+Date.now(),{cache:'no-store'})
   const x=await r.json();if(!r.ok)throw Error(x.error);setD(x);setErr('')
  }catch(e:any){setErr(e.message||'تعذر تحميل الكورس')}
 }
 useEffect(()=>{load()},[params])
 async function purchase(){
  if(!d||d.course.enrolled)return
  setBusy(true);setErr('');setMsg('')
  try{const r=await fetch('/api/student/wallet/purchase',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({courseId:d.course.id})});const x=await r.json();if(!r.ok)throw Error(x.error);setMsg(x.message||'تم شراء الكورس بنجاح');await load()}catch(e:any){setErr(e.message)}finally{setBusy(false)}
 }
 const c=d?.course
 return <DashboardShell title="الكورس"><div className="mx-auto w-full max-w-[1160px] space-y-5 pb-10">
  <Link href="/student/courses" className="inline-flex items-center gap-2 text-sm font-black text-[#6d2fa3]"><ArrowRight size={17}/> الكورسات</Link>
  {err&&<div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-bold text-red-700">{err}</div>}
  {msg&&<div className="rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-bold text-green-700">{msg}</div>}
  {!c?<div className="h-96 rounded-[28px] bg-gray-100 animate-pulse"/>:<>
   <section className="overflow-hidden rounded-[30px] border border-[#eee8f4] bg-white shadow-[0_14px_38px_rgba(42,24,65,.07)]">
    <div className="relative h-56 overflow-hidden bg-[linear-gradient(135deg,#f3eafa,#fff)] md:h-64">{c.coverUrl?<img src={c.coverUrl} alt="" className="h-full w-full object-cover"/>:<div className="grid h-full place-items-center"><BookOpen size={70} className="text-[#c9b1dc]"/></div>}<div className="absolute inset-0 bg-gradient-to-t from-[#20132e]/85 via-[#20132e]/20 to-transparent"/><div className="absolute bottom-5 right-5 left-5 text-white md:right-8 md:left-8"><div className="flex flex-wrap gap-2"><span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-black">{c.grade}</span><span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-black">{c.subject}</span>{c.enrolled&&<span className="rounded-full bg-green-500/90 px-3 py-1.5 text-xs font-black">✓ الكورس مفتوح</span>}</div><h1 className="mt-3 text-3xl font-black md:text-4xl">{c.title}</h1><p className="mt-1 text-sm text-white/80">مع {c.teacher}</p></div></div>
    <div className="grid gap-6 p-5 lg:grid-cols-[1fr_300px] md:p-7"><div><p className="text-sm leading-8 text-[#5f5868] md:text-base">{c.description||'ابدأ رحلتك التعليمية وشاهد الدروس بالترتيب، وأنجز الواجبات لفتح الدروس التالية.'}</p><div className="mt-6 grid grid-cols-3 gap-3"><div className="rounded-2xl bg-[#faf8fc] p-4"><div className="text-xl font-black">{c.totalLessons}</div><div className="mt-1 text-xs text-[#77717e]">درس</div></div><div className="rounded-2xl bg-[#faf8fc] p-4"><div className="text-xl font-black">{c.completedLessons}</div><div className="mt-1 text-xs text-[#77717e]">مكتمل</div></div><div className="rounded-2xl bg-[#faf8fc] p-4"><div className="text-xl font-black">{c.progress}%</div><div className="mt-1 text-xs text-[#77717e]">التقدم</div></div></div></div>
     <aside className="h-fit rounded-2xl border border-[#eee8f4] bg-[#fcfbfe] p-5"><div className="text-xs font-bold text-[#77717e]">رصيد المحفظة</div><div className="mt-1 text-2xl font-black">{c.balance} ج.م</div><div className="my-4 h-px bg-[#eee8f4]"/><div className="text-xs font-bold text-[#77717e]">سعر الكورس</div><div className="mt-1 text-2xl font-black">{c.price} ج.م</div>{c.enrolled?<div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-green-50 p-3 text-sm font-black text-green-700"><CheckCircle2 size={17}/> الكورس مفتوح بالفعل</div>:<button onClick={purchase} disabled={busy} className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--primary)] text-sm font-black text-white disabled:opacity-60">{busy?'جاري إتمام الشراء...':<><WalletCards size={17}/> شراء من المحفظة</>}</button>}</aside>
    </div>
   </section>

   <div className="rounded-3xl border border-[#e8def0] bg-[#faf6fd] p-5 md:p-6"><div className="flex items-start gap-3"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-[var(--primary)] shadow-sm"><LockKeyhole size={18}/></div><div><div className="text-sm font-black">نظام التقدم</div><p className="mt-1 text-xs leading-6 text-[#70687a]">بعد وجود واجب على درس، يظل الدرس التالي مقفولًا حتى يتم تسليم جميع واجبات الدرس السابق.</p></div></div></div>

   <div className="space-y-3">{c.modules?.map((m:any)=><section key={m.id} className="overflow-hidden rounded-[24px] border border-[#eee8f4] bg-white shadow-[0_8px_24px_rgba(42,24,65,.045)]">
    <button type="button" onClick={()=>setOpen(x=>({...x,[m.id]:x[m.id]===undefined?true:!x[m.id]}))} className="flex w-full items-center justify-between gap-4 bg-[#faf7fd] px-5 py-4 text-right"><div><div className="text-[11px] font-black text-[var(--primary)]">الوحدة {m.order}</div><h2 className="mt-1 text-lg font-black">{m.title}</h2><div className="mt-1 text-xs text-[#888190]">{m.lessons?.length||0} درس</div></div>{open[m.id]===false?<ChevronDown size={20}/>:<ChevronUp size={20}/>}</button>
    {open[m.id]!==false&&<div>{m.lessons?.map((l:any)=><div key={l.id} className="border-t border-[#f0ebf4] px-5 py-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><div className="flex min-w-0 items-center gap-3"><div className={'grid h-10 w-10 shrink-0 place-items-center rounded-xl '+(l.completed?'bg-green-50 text-green-600':l.locked?'bg-[#f5f2f7] text-[#8a8191]':'bg-[#f5eef9] text-[var(--primary)]')}>{l.completed?<CheckCircle2 size={18}/>:l.locked?<LockKeyhole size={17}/>:<PlayCircle size={18}/>}</div><div className="min-w-0"><div className="truncate text-sm font-black">{l.order}. {l.title}</div><div className="mt-1 text-xs text-[#888190]">{l.hasVideo?'فيديو':'محتوى'} • {l.completed?'مكتمل':Math.round(l.progress)+'% مشاهدة'}</div></div></div>{l.locked?<div className="inline-flex items-center gap-1.5 rounded-xl bg-[#f7f4f9] px-3 py-2 text-xs font-black text-[#7a7283]"><LockKeyhole size={14}/> {l.lockedReason||'مقفول'}</div>:<Link href={'/student/lessons/'+l.id} className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#e5dced] px-4 py-2 text-xs font-black text-[var(--primary)] hover:bg-[#faf6fd]">فتح الدرس <ArrowRight size={14}/></Link>}</div>
      {l.assignments?.length>0&&<div className="mt-3 rounded-2xl border border-[#eadff2] bg-[#fcf9fe] p-3.5"><div className="mb-2 flex items-center gap-2 text-xs font-black text-[var(--primary)]"><ClipboardCheck size={15}/> واجبات الدرس</div><div className="space-y-2">{l.assignments.map((a:any)=><div key={a.id} className="flex flex-col gap-2 rounded-xl bg-white p-3 md:flex-row md:items-center"><div className="min-w-0 flex-1"><div className="text-sm font-black">{a.title}</div><div className="mt-1 text-[11px] text-[#888190]">التسليم: {new Date(a.dueAt).toLocaleString('ar-EG')}</div></div>{a.submitted?<span className="inline-flex items-center gap-1 rounded-lg bg-green-50 px-3 py-2 text-[11px] font-black text-green-700"><CheckCircle2 size={14}/> تم الحل</span>:l.locked?<span className="rounded-lg bg-[#f4f1f6] px-3 py-2 text-[11px] font-black text-[#857d8b]">مغلق مع الدرس</span>:<Link href={'/student/lessons/'+l.id} className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--primary)] px-3 py-2 text-[11px] font-black text-white"><ClipboardCheck size={14}/> حل الواجب</Link>}</div>)}</div></div>}
    </div>)}</div>}</section>)}</div>
  </>}</div></DashboardShell>
}
