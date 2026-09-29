'use client'

import DashboardShell from '@/components/DashboardShell'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ArrowLeft, ClipboardPlus, Clock3, FileQuestion, Plus, RefreshCw } from 'lucide-react'

export default function TeacherExams(){
 const [exams,setExams]=useState<any[]>([])
 const [loading,setLoading]=useState(true)
 const [error,setError]=useState('')
 const load=async()=>{setLoading(true);setError('');try{const r=await fetch('/api/teacher/exams',{cache:'no-store'});const d=await r.json();if(!r.ok)throw Error(d.error);setExams(Array.isArray(d)?d:[])}catch(e:any){setError(e.message||'تعذر تحميل الامتحانات')}finally{setLoading(false)}}
 useEffect(()=>{load()},[])
 return <DashboardShell title="الامتحانات"><div className="mx-auto w-full max-w-6xl space-y-6 pb-10">
  <section className="rounded-[30px] bg-gradient-to-l from-[#4d1f78] via-[#6d2fa3] to-[#8d54bd] p-7 text-white shadow-[0_18px_45px_rgba(109,47,163,.18)]"><div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between"><div><div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold"><ClipboardPlus size={15}/> إدارة الاختبارات</div><h1 className="text-3xl font-black">امتحانات الطلاب</h1><p className="mt-2 text-sm font-medium text-white/75">أنشئ أسئلة واختيارات وحدد الإجابة الصحيحة، والطلاب يحصلون على النتيجة تلقائيًا.</p></div><div className="flex gap-2"><button onClick={load} className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-3 text-sm font-black ring-1 ring-white/20"><RefreshCw size={16}/> تحديث</button><Link href="/teacher/exams/new" className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-black text-[#6d2fa3]"><Plus size={17}/> امتحان جديد</Link></div></div></section>
  {error&&<div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-700">⚠️ {error}</div>}
  {loading?<div className="rounded-3xl border border-[#eee8f5] bg-white p-10 text-center font-bold">جاري تحميل الامتحانات...</div>:<div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{exams.map(e=><div key={e.id} className="rounded-[25px] border border-[#eee8f5] bg-white p-6 shadow-[0_12px_32px_rgba(45,25,65,.06)]"><div className="flex items-center justify-between"><span className="rounded-full bg-[#f0e7fb] px-3 py-1 text-[11px] font-black text-[#6d2fa3]">{e.durationMin||30} دقيقة</span><FileQuestion className="text-[#a88ac2]" size={23}/></div><h2 className="mt-5 text-xl font-black">{e.title}</h2><p className="mt-2 text-sm font-bold text-[#777080]">{e.course?.title||'الكورس'} • {e.questions?.length||0} سؤال</p><div className="mt-5 grid grid-cols-2 gap-2 text-xs font-bold text-[#777080]"><div className="rounded-xl bg-[#faf8fc] p-3"><Clock3 className="mb-1 text-[#6d2fa3]" size={16}/>المدة</div><div className="rounded-xl bg-[#faf8fc] p-3"><FileQuestion className="mb-1 text-[#6d2fa3]" size={16}/>الأسئلة</div></div></div>)}{!exams.length&&<div className="rounded-3xl border border-[#eee8f5] bg-white p-10 text-center md:col-span-2 lg:col-span-3"><FileQuestion className="mx-auto text-[#a88ac2]" size={36}/><h2 className="mt-4 text-xl font-black">لسه مفيش امتحانات</h2><p className="mt-2 text-sm font-bold text-[#777080]">ابدأ بإضافة أول امتحان للطلاب.</p><Link href="/teacher/exams/new" className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-[#6d2fa3] px-6 py-3 text-sm font-black text-white">إنشاء أول امتحان <ArrowLeft size={16}/></Link></div>}</div>}
 </div></DashboardShell>
}
