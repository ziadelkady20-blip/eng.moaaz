'use client'
import DashboardShell from '@/components/DashboardShell'
import Link from 'next/link'
import {use,useEffect,useMemo,useState} from 'react'
import {ArrowRight,BookOpen,CalendarDays,CheckCircle2,ChevronLeft,ClipboardCheck,ClipboardPlus,PlayCircle,Plus,Trash2} from 'lucide-react'

const input='w-full rounded-2xl border border-[#e5dfed] bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary-soft)]'

export default function Course(props:{params:Promise<{id:string}>}){
 const params=use(props.params)
 const [c,setC]=useState<any>(),[exams,setExams]=useState<any[]>([]),[busy,setBusy]=useState(false),[msg,setMsg]=useState(''),[err,setErr]=useState('')
 const [form,setForm]=useState({lessonId:'',title:'',description:'',dueAt:''})
 async function load(){
  setErr('')
  try{
   const [cr,er]=await Promise.all([fetch('/api/teacher/courses',{cache:'no-store'}),fetch('/api/teacher/exams',{cache:'no-store'})])
   const courses=await cr.json(), allExams=await er.json()
   const found=Array.isArray(courses)?courses.find((v:any)=>v.id===params.id):null
   if(!found)throw Error('الكورس غير موجود')
   setC(found);setExams(Array.isArray(allExams)?allExams.filter((x:any)=>x.courseId===params.id):[])
   if(!form.lessonId)setForm(x=>({...x,lessonId:found.modules?.[0]?.lessons?.[0]?.id||''}))
  }catch(e:any){setErr(e.message||'تعذر تحميل الكورس')}
 }
 useEffect(()=>{load()},[params.id])
 const lessons=useMemo(()=>c?.modules?.flatMap((m:any)=>m.lessons.map((l:any)=>({...l,moduleTitle:m.title})))||[],[c])
 async function addAssignment(e:any){
  e.preventDefault();setBusy(true);setErr('');setMsg('')
  try{
   const r=await fetch('/api/teacher/assignments',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...form,dueAt:form.dueAt||new Date(Date.now()+7*86400000).toISOString()})})
   const d=await r.json();if(!r.ok)throw Error(d.error)
   setMsg('تم إضافة الواجب وربطه بالدرس.');setForm(x=>({...x,title:'',description:'',dueAt:''}));await load()
  }catch(e:any){setErr(e.message||'تعذر إضافة الواجب')}finally{setBusy(false)}
 }
 async function deleteExam(id:string){
  if(!confirm('هل تريد حذف هذا الامتحان؟ سيتم حذف محاولات الطلاب ونتائجهم المرتبطة به.'))return
  const r=await fetch('/api/teacher/exams/'+id,{method:'DELETE'});if(r.ok){setMsg('تم حذف الامتحان');load()}else{const d=await r.json();setErr(d.error||'تعذر الحذف')}
 }
 if(err&&!c)return <DashboardShell title="الكورس"><div className="mx-auto max-w-5xl rounded-3xl bg-white p-10 text-center"><p className="font-black">{err}</p></div></DashboardShell>
 if(!c)return <DashboardShell title="الكورس"><div className="mx-auto max-w-5xl h-80 rounded-3xl bg-[#eee9f3] animate-pulse"/></DashboardShell>
 return <DashboardShell title={c.title}><div className="mx-auto w-full max-w-[1120px] space-y-5 pb-10">
  <Link href="/teacher/courses" className="inline-flex items-center gap-2 text-sm font-black text-[var(--primary)]"><ArrowRight size={17}/> الكورسات</Link>
  <section className="rounded-[30px] bg-[linear-gradient(135deg,#432067,#6d2fa3,#8d54bd)] p-7 text-white shadow-[0_18px_45px_rgba(109,47,163,.18)]"><div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between"><div><span className="inline-flex rounded-full bg-white/10 px-3 py-1.5 text-xs font-black">{c.grade?.name}</span><h1 className="mt-3 text-3xl font-black">{c.title}</h1><p className="mt-1 text-sm text-white/75">{c.description||'إدارة محتوى الكورس والواجبات والامتحانات.'}</p></div><Link href="/teacher/exams/new" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3.5 text-sm font-black text-[#5c2889]"><ClipboardPlus size={17}/> إنشاء امتحان</Link></div></section>
  {err&&<div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-700">⚠️ {err}</div>}{msg&&<div className="flex items-center gap-2 rounded-2xl border border-green-100 bg-green-50 p-4 text-sm font-bold text-green-700"><CheckCircle2 size={18}/>{msg}</div>}
  <div className="grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
   <section className="rounded-[26px] border border-[#eee8f4] bg-white p-5 shadow-[0_10px_30px_rgba(42,24,65,.05)]"><div className="mb-5 flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-xl bg-[#f3eafa] text-[var(--primary)]"><ClipboardCheck size={20}/></div><div><h2 className="text-xl font-black">إضافة واجب</h2><p className="mt-1 text-xs text-[#888190]">اربط الواجب بمحاضرة محددة.</p></div></div><form onSubmit={addAssignment} className="space-y-3"><select className={input} value={form.lessonId} onChange={e=>setForm({...form,lessonId:e.target.value})} required><option value="">اختر الدرس</option>{lessons.map((l:any)=><option key={l.id} value={l.id}>{l.moduleTitle} — {l.order}. {l.title}</option>)}</select><input className={input} value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="عنوان الواجب" required/><textarea className={input+' min-h-[110px] resize-none'} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="اكتب المطلوب من الطالب..."/><label className="block text-xs font-black text-[#77717e]">موعد التسليم<input className={input+' mt-2'} type="datetime-local" value={form.dueAt} onChange={e=>setForm({...form,dueAt:e.target.value})}/></label><button disabled={busy} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--primary)] text-sm font-black text-white disabled:opacity-50"><Plus size={17}/>{busy?'جاري الإضافة...':'نشر الواجب للطلاب'}</button></form></section>
   <section className="rounded-[26px] border border-[#eee8f4] bg-white p-5 shadow-[0_10px_30px_rgba(42,24,65,.05)]"><div className="mb-5 flex items-center justify-between"><div><h2 className="text-xl font-black">امتحانات الكورس</h2><p className="mt-1 text-xs text-[#888190]">الطلاب يشوفوا الامتحان ويحلوا وتحسب النتيجة تلقائيًا.</p></div><ClipboardPlus className="text-[var(--primary)]" size={21}/></div><div className="space-y-3">{exams.map((e:any)=><div key={e.id} className="rounded-2xl border border-[#eee8f4] bg-[#fcfbfe] p-4"><div className="flex items-start justify-between gap-3"><div><h3 className="font-black">{e.title}</h3><div className="mt-1 text-xs text-[#888190]">{e.questions?.length||0} سؤال · {e.durationMin||30} دقيقة</div></div><button onClick={()=>deleteExam(e.id)} className="rounded-xl bg-red-50 p-2 text-red-700"><Trash2 size={15}/></button></div></div>)}{!exams.length&&<div className="rounded-2xl border border-dashed border-[#ddd4e5] p-8 text-center text-xs font-bold text-[#888190]">لا توجد امتحانات. ابدأ بإنشاء أول امتحان.</div>}</div></section>
  </div>
  <section className="rounded-[26px] border border-[#eee8f4] bg-white p-5 shadow-[0_10px_30px_rgba(42,24,65,.05)]"><div className="mb-5 flex items-center justify-between"><div><h2 className="text-xl font-black">محتوى الكورس</h2><p className="mt-1 text-xs text-[#888190]">الدروس التي سيتعلم منها الطلاب.</p></div><BookOpen className="text-[var(--primary)]" size={22}/></div><div className="space-y-3">{c.modules.map((m:any)=><div className="rounded-2xl border border-[#eee8f4] p-4" key={m.id}><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#f3eafa] text-xs font-black text-[var(--primary)]">{m.order}</span><h3 className="font-black">{m.title}</h3></div><div className="mt-3 space-y-2">{m.lessons.map((l:any)=><div key={l.id} className="flex items-center gap-3 rounded-xl bg-[#faf8fc] p-3"><PlayCircle size={16} className="text-[var(--primary)]"/><span className="text-sm font-black">{l.order}. {l.title}</span><span className="mr-auto text-[11px] font-bold text-[#8a8391]">{l.video?'فيديو مرتبط':'بدون فيديو'}</span></div>)}</div></div>)}</div></section>
 </div></DashboardShell>
}
