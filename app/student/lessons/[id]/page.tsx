'use client'
import DashboardShell from '@/components/DashboardShell'
import SecureYoutubePlayer from '@/components/SecureYoutubePlayer'
import {useEffect,useState} from 'react'
import Link from 'next/link'
import {ArrowRight,CheckCircle2,ClipboardCheck,FileText,LockKeyhole,PlayCircle,Send} from 'lucide-react'

export default function Lesson({params}:{params:Promise<{id:string}>}){
 const [data,setData]=useState<any>(null),[error,setError]=useState(''),[saving,setSaving]=useState(false),[done,setDone]=useState(false),[submitting,setSubmitting]=useState(''),[links,setLinks]=useState<Record<string,string>>({})
 async function load(){
  try{
   const p=await params
   const r=await fetch('/api/student/lessons/'+p.id+'?ts='+Date.now(),{cache:'no-store'})
   const d=await r.json();if(!r.ok)throw new Error(d.error)
   setData(d);setDone(!!d.lesson.progress.completed)
   const next:Record<string,string>={}
   ;(d.lesson.assignments||[]).forEach((a:any)=>{next[a.id]=a.submission?.fileUrl||''})
   setLinks(next);setError('')
  }catch(e:any){setError(e.message||'تعذر تحميل الدرس')}
 }
 useEffect(()=>{load()},[params])
 async function complete(){
  if(!data)return
  setSaving(true)
  try{const r=await fetch('/api/student/progress',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({lessonId:data.lesson.id,watchedPct:100,lastPositionSec:data.lesson.progress.lastPositionSec,completed:true})});if(r.ok){setDone(true);setData((x:any)=>({...x,lesson:{...x.lesson,progress:{...x.lesson.progress,watchedPct:100,completed:true}}}))}}finally{setSaving(false)}
 }
 async function submitAssignment(id:string){
  setSubmitting(id);setError('')
  try{
   const r=await fetch('/api/assignments/'+id+'/submit',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({fileUrl:links[id]||''})})
   const d=await r.json();if(!r.ok)throw Error(d.error)
   setData((x:any)=>({...x,lesson:{...x.lesson,assignments:x.lesson.assignments.map((a:any)=>a.id===id?{...a,submission:d.submission}:a)}}))
  }catch(e:any){setError(e.message||'تعذر تسليم الواجب')}finally{setSubmitting('')}
 }
 return <DashboardShell title="الدرس"><div className="mx-auto w-full max-w-[1040px] space-y-5 pb-10">
  <Link href="/student/courses" className="inline-flex items-center gap-2 text-sm font-black text-[#6d2fa3]"><ArrowRight size={17}/> الكورسات</Link>
  {error?<div className="rounded-[24px] border border-red-200 bg-red-50 px-6 py-12 text-center"><LockKeyhole className="mx-auto text-red-500" size={42}/><h1 className="mt-4 text-xl font-black">المحتوى غير متاح</h1><p className="mx-auto mt-2 max-w-lg text-sm leading-7 text-red-700">{error}</p></div>
  :!data?<div className="h-96 rounded-[28px] bg-gray-100 animate-pulse"/>
  :<><header className="rounded-[24px] border border-[#eee8f4] bg-white px-6 py-5 shadow-[0_10px_30px_rgba(42,24,65,.06)]"><div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><div><div className="text-xs font-black text-[var(--primary)]">{data.lesson.course}</div><h1 className="mt-1 text-2xl font-black md:text-3xl">{data.lesson.title}</h1></div><div className="w-full md:w-56"><div className="flex justify-between text-xs font-bold"><span>التقدم</span><span>{Math.round(data.lesson.progress.watchedPct)}%</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-[#eeeaf4]"><div className="h-full rounded-full bg-[var(--primary)]" style={{width:data.lesson.progress.watchedPct+'%'}}/></div></div></div></header>
   <section className="overflow-hidden rounded-[26px] border border-[#2b2530] bg-[#151219] shadow-[0_18px_45px_rgba(25,17,31,.15)]">{data.lesson.video?<SecureYoutubePlayer videoId={data.lesson.video.id} title={data.lesson.title} viewerName={data.viewer?.name} viewerPhone={data.viewer?.phone}/>:<div className="grid aspect-video place-items-center text-center text-white/60"><div><PlayCircle className="mx-auto" size={54}/><p className="mt-3 text-sm">الفيديو لم يتم نشره بعد.</p></div></div>}</section>

   {data.lesson.assignments?.length>0&&<section className="overflow-hidden rounded-[26px] border border-[#eadff2] bg-white shadow-[0_10px_30px_rgba(42,24,65,.05)]"><div className="border-b border-[#eee8f4] bg-[#faf6fd] p-5"><div className="flex items-start gap-3"><div className="grid h-11 w-11 place-items-center rounded-xl bg-white text-[var(--primary)] shadow-sm"><ClipboardCheck size={19}/></div><div><h2 className="text-lg font-black">واجب الدرس</h2><p className="mt-1 text-xs leading-6 text-[#77717e]">حل الواجب ثم اضغط على «تأكيد تسليم الحل» لفتح الدرس التالي.</p></div></div></div><div className="space-y-3 p-5">{data.lesson.assignments.map((a:any)=><div key={a.id} className="rounded-2xl border border-[#eee8f4] bg-[#fcfbfe] p-4"><div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between"><div className="flex-1"><div className="text-base font-black">{a.title}</div><p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-[#625b6b]">{a.description||'لا يوجد وصف إضافي للواجب.'}</p><div className="mt-3 text-[11px] font-bold text-[#888190]">موعد التسليم: {new Date(a.dueAt).toLocaleString('ar-EG')}</div></div>{a.submission?.submittedAt?<div className="inline-flex items-center gap-2 rounded-xl bg-green-50 px-4 py-2.5 text-xs font-black text-green-700"><CheckCircle2 size={16}/> تم تسليم الواجب</div>:<div className="w-full md:w-80"><input className="w-full rounded-xl border border-[#e5dfed] bg-white px-3 py-2.5 text-xs font-semibold outline-none focus:border-[var(--primary)]" placeholder="رابط ملف الحل (اختياري)" value={links[a.id]||''} onChange={e=>setLinks(x=>({...x,[a.id]:e.target.value}))}/><button type="button" disabled={submitting===a.id} onClick={()=>submitAssignment(a.id)} className="mt-2 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-4 text-xs font-black text-white disabled:opacity-60">{submitting===a.id?'جارٍ التسليم...':<><Send size={15}/> تأكيد تسليم الحل</>}</button></div>}</div></div>)}</div></section>}

   <section className="flex flex-col gap-4 rounded-[24px] border border-[#eee8f4] bg-white p-5 md:flex-row md:items-center md:justify-between"><div className="flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-xl bg-[#f4ecfa] text-[var(--primary)]"><FileText size={19}/></div><div><div className="text-sm font-black">بعد مشاهدة الدرس</div><div className="mt-1 text-xs text-[#888190]">سجّل الدرس كمكتمل لتحديث تقدمك.</div></div></div><button onClick={complete} disabled={saving||done} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-5 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-55">{done?<><CheckCircle2 size={17}/> تم إكمال الدرس</>:saving?'جارٍ الحفظ...':'إكمال الدرس'}</button></section>
   {data.lesson.resources?.length>0&&<section className="rounded-[24px] border border-[#eee8f4] bg-white p-5"><h2 className="text-lg font-black">مرفقات الدرس</h2><div className="mt-3 flex flex-wrap gap-2">{data.lesson.resources.map((r:any)=><a key={r.id} href={r.url} target="_blank" rel="noreferrer" className="rounded-xl border border-[#e5dced] px-4 py-2.5 text-xs font-black text-[var(--primary)] hover:bg-[#faf6fd]">📎 {r.name}</a>)}</div></section>}
  </>}</div></DashboardShell>
}
