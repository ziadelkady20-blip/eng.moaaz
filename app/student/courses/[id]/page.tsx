'use client'

import DashboardShell from '@/components/DashboardShell'
import {useEffect,useState} from 'react'
import Link from 'next/link'

export default function CoursePage({params}:{params:Promise<{id:string}>}){
 const [d,setD]=useState<any>()
 const [err,setErr]=useState('')
 const [busy,setBusy]=useState(false)
 const [msg,setMsg]=useState('')
 const [openModules,setOpenModules]=useState<Record<string,boolean>>({})

 async function load(){
  try{
   const p=await params
   const r=await fetch(`/api/student/courses/${p.id}?ts=${Date.now()}`,{cache:'no-store'})
   const x=await r.json()
   if(!r.ok)throw Error(x.error)
   setD(x)
   setErr('')
  }catch(e:any){
   setErr(e.message||'تعذر تحميل الكورس')
  }
 }

 useEffect(()=>{load()},[params])

 async function purchase(){
  if(!d||d.course.enrolled)return
  setBusy(true)
  setErr('')
  setMsg('')
  try{
   const r=await fetch('/api/student/wallet/purchase',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({courseId:d.course.id})
   })
   const x=await r.json()
   if(!r.ok)throw Error(x.error)
   setMsg(x.message||'تم شراء الكورس بنجاح')
   await load()
  }catch(e:any){
   setErr(e.message)
  }finally{
   setBusy(false)
  }
 }

 const c=d?.course

 return (
  <DashboardShell title="الكورس">
   <Link href="/student/courses" className="btn btn-soft mb-4">← الرجوع للكورسات</Link>

   {err&&<div className="card p-4 mt-5 bg-red-50 text-red-700">{err}</div>}
   {msg&&<div className="card p-4 mt-5 bg-green-50 text-green-700">{msg}</div>}

   {!c ? (
    <div className="card p-10 mt-5 animate-pulse">جاري تحميل الكورس...</div>
   ) : (
    <div className="mt-5">
     <div className="card p-6 md:p-8">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
       <div className="flex-1">
        <div className="flex flex-wrap gap-2">
         <span className="badge">{c.grade}</span>
         <span className="badge">{c.subject}</span>
         {c.enrolled&&<span className="badge">✓ مملوك لك</span>}
        </div>
        <h1 className="text-3xl md:text-4xl font-black mt-4">{c.title}</h1>
        <p className="muted mt-2">مع {c.teacher}</p>
        <p className="mt-5 leading-8">{c.description}</p>
       </div>

       <div className="w-full lg:w-72 rounded-2xl border p-5 bg-white">
        <div className="muted text-sm">رصيد المحفظة</div>
        <div className="text-2xl font-black mt-1">{c.balance} ج.م</div>
        <div className="border-t my-4"/>
        <div className="muted text-sm">سعر الكورس</div>
        <div className="text-2xl font-black mt-1">{c.price} ج.م</div>
        {c.enrolled ? (
         <div className="mt-4 text-center font-bold text-green-700 bg-green-50 rounded-xl p-3">الكورس مفتوح بالفعل</div>
        ) : (
         <button onClick={purchase} disabled={busy} className="btn btn-primary w-full mt-4">
          {busy?'جاري إتمام الشراء...':'شراء من المحفظة'}
         </button>
        )}
       </div>
      </div>
     </div>

     <div className="space-y-4 mt-6">
      {(c.modules||[]).map((m:any)=>(
       <div key={m.id} className="card overflow-hidden">
        <div className="p-5 bg-[var(--primary-soft)] flex items-center justify-between gap-3">
         <div>
          <div className="text-xs font-black text-[var(--primary)]">الوحدة {m.order||''}</div>
          <h2 className="font-black text-xl mt-1">{m.title}</h2>
         </div>
         <button
          type="button"
          onClick={()=>setOpenModules(x=>({...x,[m.id]:x[m.id]===undefined?false:!x[m.id]}))}
          className="btn btn-soft"
         >
          {openModules[m.id]===false?'عرض الدروس':'إخفاء الدروس'}
         </button>
        </div>

        {openModules[m.id]!==false&&(
         <div>
          {(m.lessons||[]).map((l:any)=>(
           <div key={l.id} className="flex items-center justify-between gap-4 p-5 border-t">
            <div className="min-w-0">
             <b>{l.order}. {l.title}</b>
             <div className="text-sm muted mt-1">
              {l.hasVideo?'فيديو':'محتوى نصي'} • {l.completed?'مكتمل':`${Math.round(l.progress)}%`}
             </div>
            </div>
            {l.locked ? (
             <span className="badge">🔒 مقفول</span>
            ) : (
             <Link href={`/student/lessons/${l.id}`} className="btn btn-soft">فتح الدرس</Link>
            )}
           </div>
          ))}
         </div>
        )}
       </div>
      ))}
     </div>
    </div>
   )}
  </DashboardShell>
 )
}
