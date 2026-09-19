'use client'
import DashboardShell from '@/components/DashboardShell'
import {useEffect,useState} from 'react'
import Link from 'next/link'
import {ArrowRight,CheckCircle2,ClipboardCheck,Clock3,Send} from 'lucide-react'

export default function Assignments(){
 const [data,setData]=useState<any>(),[busy,setBusy]=useState(''),[links,setLinks]=useState<Record<string,string>>({})
 useEffect(()=>{fetch('/api/student/assignments',{cache:'no-store'}).then(r=>r.json()).then(d=>{setData(d);const x:Record<string,string>={};(d.assignments||[]).forEach((a:any)=>x[a.id]=a.submissions?.[0]?.fileUrl||'');setLinks(x)})},[])
 async function submit(id:string){
  setBusy(id)
  try{
   const r=await fetch('/api/assignments/'+id+'/submit',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({fileUrl:links[id]||''})})
   const d=await r.json()
   if(r.ok)setData((x:any)=>({...x,assignments:x.assignments.map((a:any)=>a.id===id?{...a,submissions:[d.submission]}:a)}))
  }finally{setBusy('')}
 }
 if(!data)return <DashboardShell title="الواجبات"><div className="mx-auto max-w-5xl rounded-[28px] border border-[#eee8f4] bg-white p-10 text-center animate-pulse">جاري تحميل الواجبات...</div></DashboardShell>
 return <DashboardShell title="الواجبات"><div className="mx-auto w-full max-w-5xl space-y-5 pb-10">
  <header className="rounded-[30px] bg-[linear-gradient(135deg,#4d1f78,#6d2fa3)] p-7 text-white shadow-[0_18px_45px_rgba(109,47,163,.18)]"><div className="flex items-center gap-4"><div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10"><ClipboardCheck size={23}/></div><div><h1 className="text-3xl font-black">واجباتي</h1><p className="mt-1 text-sm font-medium text-white/75">حل واجب كل درس لتفتح الدرس التالي في الكورس.</p></div></div></header>
  <div className="grid gap-4 md:grid-cols-2">{data.assignments.map((a:any)=>{const sub=a.submissions?.[0];return <article key={a.id} className="rounded-[24px] border border-[#eee8f4] bg-white p-5 shadow-[0_8px_24px_rgba(42,24,65,.045)]"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><div className="text-xs font-black text-[var(--primary)]">{a.course?.title}</div><h2 className="mt-1 text-lg font-black">{a.title}</h2>{a.lesson&&<div className="mt-1 text-xs font-bold text-[#888190]">الدرس: {a.lesson.title}</div>}</div>{sub?.submittedAt?<span className="inline-flex shrink-0 items-center gap-1 rounded-xl bg-green-50 px-3 py-2 text-[11px] font-black text-green-700"><CheckCircle2 size={14}/> تم الحل</span>:<span className="inline-flex shrink-0 items-center gap-1 rounded-xl bg-[#f6f1fa] px-3 py-2 text-[11px] font-black text-[var(--primary)]"><Clock3 size={14}/> مطلوب</span>}</div><p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-[#625b6b]">{a.description||'لا يوجد وصف إضافي.'}</p><div className="mt-4 rounded-2xl bg-[#faf8fc] p-3 text-xs font-bold text-[#77717e]">موعد التسليم: {new Date(a.dueAt).toLocaleString('ar-EG')}</div>{!sub?.submittedAt&&<><input className="mt-3 w-full rounded-xl border border-[#e5dfed] px-3 py-2.5 text-xs font-semibold outline-none focus:border-[var(--primary)]" placeholder="رابط ملف الحل (اختياري)" value={links[a.id]||''} onChange={e=>setLinks(x=>({...x,[a.id]:e.target.value}))}/><div className="mt-3 flex gap-2"><Link href={'/student/lessons/'+(a.lesson?.id||'')} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#e5dfed] px-3 py-2.5 text-xs font-black text-[var(--primary)]">فتح الدرس <ArrowRight size={14}/></Link><button disabled={busy===a.id} onClick={()=>submit(a.id)} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[var(--primary)] px-3 py-2.5 text-xs font-black text-white disabled:opacity-50">{busy===a.id?'جارٍ...':<><Send size={14}/> تأكيد الحل</>}</button></div></>}</article>})}{!data.assignments.length&&<div className="rounded-[24px] border border-dashed border-[#ddd4e5] p-10 text-center text-sm font-bold text-[#77717e] md:col-span-2">لا توجد واجبات متاحة حاليًا.</div>}</div>
 </div></DashboardShell>
}
