'use client'

import AdminShell from '@/components/AdminShell'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Payments(){
  const [orders,setOrders]=useState<any[]>([])
  const [walletRequests,setWalletRequests]=useState<any[]>([])
  const [error,setError]=useState('')
  const [loading,setLoading]=useState(false)
  const [busy,setBusy]=useState('')

  async function load(){
    setLoading(true); setError('')
    const errors:string[]=[]
    try{
      const r=await fetch('/api/admin/payments?ts='+Date.now(),{cache:'no-store'})
      const d=await r.json()
      if(!r.ok) errors.push(d.error||'تعذر تحميل المدفوعات القديمة')
      else setOrders(d.orders||[])
    }catch{errors.push('تعذر الاتصال بمدفوعات الحجوزات')}
    try{
      const r=await fetch('/api/admin/wallet/recharges?ts='+Date.now(),{cache:'no-store',headers:{'Cache-Control':'no-cache'}})
      const d=await r.json()
      if(!r.ok) errors.push(d.error||'تعذر تحميل طلبات شحن المحافظ')
      else setWalletRequests(d.requests||[])
    }catch{errors.push('تعذر الاتصال بطلبات شحن المحافظ')}
    if(errors.length) setError(errors.join(' — '))
    setLoading(false)
  }

  useEffect(()=>{load();const timer=setInterval(load,10000);return()=>clearInterval(timer)},[])

  async function act(id:string,kind:string){
    setBusy(id)
    try{
      const r=await fetch(`/api/admin/payments/${id}/${kind}`,{method:'POST'})
      const d=await r.json()
      if(!r.ok) throw new Error(d.error||'تعذر تنفيذ العملية')
      await load()
    }catch(e:any){setError(e.message)}
    finally{setBusy('')}
  }

  async function actWallet(id:string,action:'APPROVE'|'REJECT'){
    setBusy(id)
    try{
      const r=await fetch(`/api/admin/wallet/recharges/${id}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action})})
      const d=await r.json()
      if(!r.ok) throw new Error(d.error||'تعذر تنفيذ طلب الشحن')
      await load()
    }catch(e:any){setError(e.message)}
    finally{setBusy('')}
  }

  return <AdminShell>
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
      <div><h1 className="text-3xl font-black">المدفوعات والحجوزات</h1><p className="muted mt-2 mb-7">كل طلبات الدفع القديمة وشحن المحافظ تظهر هنا في لوحة الإدارة.</p></div>
      <div className="flex gap-2"><button onClick={load} disabled={loading} className="btn btn-soft">{loading?'جاري التحديث...':'تحديث الطلبات'}</button><Link href="/admin/wallet" className="btn btn-primary">تفاصيل محفظة الطلاب</Link></div>
    </div>

    {error&&<div className="card p-4 mb-5 bg-red-50 text-red-700">{error}</div>}

    <section className="mb-8">
      <div className="flex items-center justify-between mb-4"><div><h2 className="text-xl font-black">طلبات شحن المحافظ</h2><p className="muted text-sm mt-1">أي طلب يرسله الطالب يظهر هنا فورًا، ويمكنك اعتماده لإضافة الرصيد.</p></div><span className="badge">{walletRequests.filter(r=>r.status==='PENDING').length} قيد المراجعة</span></div>
      {walletRequests.length===0?<div className="card p-8 text-center muted">لا توجد طلبات شحن محافظ حاليًا.</div>:<div className="space-y-3">{walletRequests.map(r=><div key={r.id} className="card p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4"><div><div className="font-black text-lg">{r.studentName||'طالب'} <span className="badge mr-2">{r.status==='PENDING'?'قيد المراجعة':r.status==='APPROVED'?'مقبول':'مرفوض'}</span></div><div className="muted text-sm mt-1">{r.studentPhone||'—'} • {r.amount} ج.م • {r.method}</div><div className="text-sm mt-1">الهاتف المحول منه: <b>{r.senderPhone}</b></div></div><div className="flex flex-wrap gap-2"><a href={`/api/admin/wallet/recharges/${r.id}/proof`} target="_blank" rel="noreferrer" className="btn btn-soft">عرض الإثبات</a>{r.status==='PENDING'&&<><button disabled={busy===r.id} onClick={()=>actWallet(r.id,'APPROVE')} className="btn btn-primary">تأكيد وإضافة الرصيد</button><button disabled={busy===r.id} onClick={()=>actWallet(r.id,'REJECT')} className="btn btn-secondary">رفض</button></>}</div></div>)}</div>}
    </section>

    <section>
      <h2 className="text-xl font-black mb-4">المدفوعات والحجوزات القديمة</h2>
      <div className="space-y-4">{orders.map(o=>{const p=o.payments[0];return <div key={o.id} className="card p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4"><div><div className="font-black text-lg">{o.student.user.name} — {o.course.title}</div><div className="muted text-sm mt-1">{o.student.user.phone} • {o.amount} ج.م • {p?.method||'دفع يدوي'}</div>{o.discount>0&&<div className="text-sm mt-1">خصم: {o.discount} ج.م {o.couponCode?`(${o.couponCode})`:''}</div>}{p?.reference&&<div className="text-sm mt-1">مرجع الدفع: {p.reference}</div>}</div><div className="flex flex-wrap items-center gap-2"><span className="badge">{o.status==='CONFIRMED'?'مؤكد':o.status==='CANCELLED'?'ملغي':'في الانتظار'}</span>{o.status==='PENDING'&&p&&<><button disabled={busy===p.id} onClick={()=>act(p.id,'confirm')} className="btn btn-primary">تأكيد وفتح المحتوى</button><button disabled={busy===p.id} onClick={()=>act(p.id,'reject')} className="btn btn-secondary">رفض</button></>}{o.status==='CONFIRMED'&&p&&<button disabled={busy===p.id} onClick={()=>act(p.id,'refund')} className="btn btn-secondary">استرداد وإغلاق المحتوى</button>}</div></div>})}{!orders.length&&<div className="card p-10 text-center muted">لا توجد حجوزات حتى الآن.</div>}</div>
    </section>
  </AdminShell>
}
