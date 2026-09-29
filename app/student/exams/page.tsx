'use client'

import DashboardShell from '@/components/DashboardShell'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, CheckCircle2, Clock3, FileQuestion, LockKeyhole, Trophy } from 'lucide-react'

export default function Exams(){
 const [data,setData]=useState<any>()
 const [active,setActive]=useState<any>()
 const [answers,setAnswers]=useState<Record<string,string>>({})
 const [result,setResult]=useState<any>()
 const [seconds,setSeconds]=useState(0)
 const [busy,setBusy]=useState(false)

 useEffect(()=>{fetch('/api/student/exams',{cache:'no-store'}).then(r=>r.json()).then(setData)},[])
 useEffect(()=>{if(!active)return;setSeconds((active.exam.durationMin||30)*60)},[active])
 useEffect(()=>{if(!active||result||seconds<=0)return;const t=setInterval(()=>setSeconds(s=>s-1),1000);return()=>clearInterval(t)},[active,result,seconds])
 useEffect(()=>{if(active&&!result&&seconds===0)submit()},[seconds])

 const unanswered=useMemo(()=>active?active.exam.questions.filter((q:any)=>!answers[q.id]).length:0,[active,answers])
 const clock=`${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`

 async function start(id:string){
  const r=await fetch(`/api/student/exams/${id}/start`,{method:'POST'});const d=await r.json();if(r.ok){setResult(null);setAnswers({});setActive(d)}else alert(d.error)
 }
 async function submit(){
  if(!active||busy)return
  if(unanswered>0&&seconds>0&&!confirm(`لسه عندك ${unanswered} سؤال بدون إجابة. هل تريد التسليم؟`))return
  setBusy(true)
  const r=await fetch(`/api/student/exams/${active.exam.id}/submit`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({attemptId:active.attemptId,answers:Object.entries(answers).map(([questionId,selectedOptionId])=>({questionId,selectedOptionId}))})})
  const d=await r.json();if(r.ok)setResult(d);else alert(d.error);setBusy(false)
 }

 if(!data)return <DashboardShell title="الامتحانات"><div className="card p-10 text-center font-bold">جاري تحميل الامتحانات...</div></DashboardShell>

 if(result)return <DashboardShell title="نتيجة الامتحان"><div className="mx-auto max-w-2xl py-8"><div className="overflow-hidden rounded-[30px] border border-[#eee8f5] bg-white shadow-[0_20px_60px_rgba(45,25,65,.08)]"><div className="bg-gradient-to-l from-[#4d1f78] via-[#6d2fa3] to-[#8d54bd] p-8 text-center text-white"><div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-white/10"><Trophy size={31}/></div><h1 className="mt-4 text-2xl font-black">تم تسليم الامتحان بنجاح 🎉</h1><p className="mt-2 text-sm font-bold text-white/75">دي نتيجتك في الامتحان</p></div><div className="p-8 text-center"><div className="text-7xl font-black text-[#6d2fa3]">{result.score}%</div><div className="mx-auto mt-5 max-w-md rounded-2xl bg-[#f8f4fb] p-4 text-sm font-bold text-[#5f5668]">أجبت بشكل صحيح على <b className="text-[#6d2fa3]">{result.points}</b> من <b>{result.max}</b> درجة.</div><button className="mt-7 inline-flex h-12 items-center justify-center rounded-2xl bg-[#6d2fa3] px-7 font-black text-white" onClick={()=>{setResult(null);setActive(null);setAnswers({});fetch('/api/student/exams',{cache:'no-store'}).then(r=>r.json()).then(setData)}}>العودة للامتحانات</button></div></div></div></DashboardShell>

 if(active)return <DashboardShell title="الامتحان"><div className="mx-auto max-w-4xl space-y-5 pb-10"><Link href="/student/exams" onClick={e=>{e.preventDefault();setActive(null)}} className="inline-flex items-center gap-2 text-sm font-black text-[#6d2fa3]"><ArrowRight size={17}/> كل الامتحانات</Link><section className="rounded-[28px] bg-gradient-to-l from-[#4d1f78] via-[#6d2fa3] to-[#8d54bd] p-6 text-white shadow-[0_18px_45px_rgba(109,47,163,.18)]"><div className="flex flex-wrap items-center justify-between gap-4"><div><div className="text-xs font-black text-white/70">امتحان إلكتروني</div><h1 className="mt-2 text-2xl font-black">{active.exam.title}</h1><div className="mt-2 text-sm font-bold text-white/75">{active.exam.questions.length} سؤال • النتيجة تظهر فورًا بعد التسليم</div></div><div className="rounded-2xl bg-white/10 px-5 py-3 text-center"><Clock3 className="mx-auto" size={19}/><div className="mt-1 text-xl font-black tabular-nums">{clock}</div></div></div></section>{active.exam.questions.map((q:any,i:number)=><section key={q.id} className="rounded-[26px] border border-[#eee8f5] bg-white p-5 shadow-[0_10px_30px_rgba(42,24,65,.045)]"><div className="flex items-start gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#f3eafa] text-sm font-black text-[#6d2fa3]">{i+1}</span><div className="flex-1"><h2 className="text-lg font-black leading-8 text-[#292238]">{q.text}</h2><div className="mt-4 grid gap-3 sm:grid-cols-2">{q.options.map((o:any)=><label key={o.id} className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-4 text-sm font-bold transition ${answers[q.id]===o.id?'border-[#8b5cf6] bg-[#f6f0fc] text-[#4d1f78]':'border-[#eee8f5] bg-[#fcfbfe] hover:border-[#d7c4e8]'}`}><input type="radio" name={q.id} checked={answers[q.id]===o.id} onChange={()=>setAnswers(a=>({...a,[q.id]:o.id}))}/><span>{o.text}</span></label>)}</div></div></div></section>)}<div className="sticky bottom-4 rounded-2xl border border-[#eee8f5] bg-white/95 p-3 shadow-[0_15px_35px_rgba(45,25,65,.12)] backdrop-blur"><button disabled={busy} onClick={submit} className="inline-flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-[#6d2fa3] font-black text-white disabled:opacity-50">{busy?'جاري التصحيح...':'تسليم الامتحان'} <CheckCircle2 size={18}/></button></div></div></DashboardShell>

 return <DashboardShell title="الامتحانات"><div className="mx-auto w-full max-w-6xl pb-10"><section className="rounded-[30px] bg-gradient-to-l from-[#4d1f78] via-[#6d2fa3] to-[#8d54bd] p-7 text-white shadow-[0_18px_45px_rgba(109,47,163,.18)]"><div className="flex items-center gap-4"><div className="grid h-14 w-14 place-items-center rounded-2xl bg-white/10"><FileQuestion size={27}/></div><div><h1 className="text-3xl font-black">الامتحانات</h1><p className="mt-1 text-sm font-semibold text-white/75">حل الامتحان، سلّم إجاباتك وشوف نتيجتك فورًا.</p></div></div></section><div className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{data.exams.map((e:any)=><div className="rounded-[25px] border border-[#eee8f5] bg-white p-6 shadow-[0_12px_32px_rgba(45,25,65,.06)]" key={e.id}><div className="flex items-center justify-between"><span className="rounded-full bg-[#f0e7fb] px-3 py-1 text-[11px] font-black text-[#6d2fa3]">{e.durationMin||30} دقيقة</span><FileQuestion className="text-[#a88ac2]" size={22}/></div><h2 className="mt-5 text-xl font-black text-[#292238]">{e.title}</h2><p className="mt-2 text-sm font-bold text-[#777080]">{e.course?.title||'اختبار'} • {e.questions.length} سؤال</p><button onClick={()=>start(e.id)} className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-2xl bg-[#6d2fa3] font-black text-white">ابدأ الاختبار</button></div>)}{!data.exams.length&&<div className="rounded-[25px] border border-[#eee8f5] bg-white p-10 text-center text-sm font-bold text-[#777080] md:col-span-2 lg:col-span-3"><LockKeyhole className="mx-auto text-[#a88ac2]" size={34}/><p className="mt-3">لا توجد امتحانات متاحة لك حاليًا.</p></div>}</div></div></DashboardShell>
}
