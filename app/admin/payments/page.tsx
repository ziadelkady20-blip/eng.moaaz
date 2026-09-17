'use client'

import AdminShell from '@/components/AdminShell'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, Clock3, WalletCards, XCircle, Eye, RefreshCw } from 'lucide-react'

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

  const pending=walletRequests.filter(r=>r.status==='PENDING').length
  const approved=walletRequests.filter(r=>r.status==='APPROVED').length
  const rejected=walletRequests.filter(r=>r.status==='REJECTED').length

  return <AdminShell>
    <div dir="rtl" className="space-y-8">
      <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2"><div className="w-11 h-11 rounded-2xl bg-[var(--primary-soft)] flex items-center justify-center text-[var(--primary)]"><WalletCards size={23}/></div><div><h1 className="text-3xl font-black">المدفوعات والحجوزات</h1><p className="muted mt-1">إدارة طلبات شحن المحافظ والمدفوعات القديمة من مكان واحد.</p></div></div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={load} disabled={loading} className="btn btn-soft"><RefreshCw size={16} className={loading?'animate-spin':''}/>{loading?'جاري التحديث...':'تحديث الطلبات'}</button>
          <Link href="/admin/wallet" className="btn btn-primary"><WalletCards size={16}/>محفظة الطلاب</Link>
        </div>
      </header>

      {error&&<div className="card p-4 border border-red-200 bg-red-50 text-red-700 font-bold">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-5"><div className="flex items-center justify-between"><span className="muted font-bold">قيد المراجعة</span><Clock3 size={20}/></div><div className="text-3xl font-black mt-3">{pending}</div><div className="muted text-xs mt-1">طلبات تحتاج إجراء من الأدمن</div></div>
        <div className="card p-5"><div className="flex items-center justify-between"><span className="muted font-bold">مقبولة</span><CheckCircle2 size={20}/></div><div className="text-3xl font-black mt-3">{approved}</div><div className="muted text-xs mt-1">تمت إضافة الرصيد لها</div></div>
        <div className="card p-5"><div className="flex items-center justify-between"><span className="muted font-bold">مرفوضة</span><XCircle size={20}/></div><div className="text-3xl font-black mt-3">{rejected}</div><div className="muted text-xs mt-1">طلبات تم رفضها</div></div>
      </div>

      <section>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-4">
          <div><h2 className="text-2xl font-black">طلبات شحن المحافظ</h2><p className="muted mt-1">راجع إثبات التحويل ثم اعتمد الطلب لإضافة الرصيد للطالب.</p></div>
          <span className="badge text-sm">{pending} قيد المراجعة</span>
        </div>

        {walletRequests.length===0 ? <div className="card p-10 text-center"><WalletCards className="mx-auto mb-3 opacity-40" size={34}/><div className="font-black text-lg">لا توجد طلبات شحن</div><div className="muted mt-2">أي طلب جديد سيظهر تلقائيًا خلال ثوانٍ.</div></div> :
        <div className="grid gap-4">
          {walletRequests.map(r=><article key={r.id} className="card overflow-hidden">
            <div className="p-5 border-b flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2"><h3 className="font-black text-xl">{r.studentName||'طالب'}</h3><span className="badge">{r.status==='PENDING'?'قيد المراجعة':r.status==='APPROVED'?'مقبول':'مرفوض'}</span></div>
                <div className="muted text-sm mt-2">{r.studentPhone||'—'} <span className="mx-1">•</span> {r.method}</div>
              </div>
              <div className="text-right md:text-left"><div className="text-3xl font-black">{r.amount} <span className="text-base font-bold">ج.م</span></div><div className="muted text-xs mt-1">قيمة طلب الشحن</div></div>
            </div>
            <div className="p-5 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-5 items-center">
              <div className="space-y-3">
                <div className="rounded-2xl bg-[var(--bg)] border p-4"><div className="muted text-xs font-bold mb-1">الهاتف المحول منه</div><div className="font-black text-lg tracking-wide">{r.senderPhone||'غير مسجل'}</div></div>
                <div className="muted text-xs">تم إرسال الطلب: {r.createdAt?new Date(r.createdAt).toLocaleString('ar-EG'):''}</div>
              </div>
              <div className="flex flex-wrap lg:flex-nowrap gap-2 justify-start lg:justify-end">
                <a href={`/api/admin/wallet/recharges/${r.id}/proof`} target="_blank" rel="noreferrer" className="btn btn-soft"><Eye size={17}/>عرض الإثبات</a>
                {r.status==='PENDING'&&<><button disabled={busy===r.id} onClick={()=>actWallet(r.id,'APPROVE')} className="btn btn-primary"><CheckCircle2 size={17}/>{busy===r.id?'جاري...':'تأكيد وإضافة الرصيد'}</button><button disabled={busy===r.id} onClick={()=>actWallet(r.id,'REJECT')} className="btn btn-secondary"><XCircle size={17}/>رفض</button></>}
              </div>
            </div>
          </article>)}
        </div>}
      </section>

      <section>
        <div className="mb-4"><h2 className="text-2xl font-black">المدفوعات والحجوزات القديمة</h2><p className="muted mt-1">الطلبات التي تستخدم نظام الدفع القديم.</p></div>
        <div className="grid gap-4">
          {orders.map(o=>{const p=o.payments[0];return <article key={o.id} className="card p-5"><div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4"><div><div className="font-black text-lg">{o.student.user.name} — {o.course.title}</div><div className="muted text-sm mt-1">{o.student.user.phone} • {o.amount} ج.م • {p?.method||'دفع يدوي'}</div>{o.discount>0&&<div className="text-sm mt-1">خصم: {o.discount} ج.م {o.couponCode?`(${o.couponCode})`:''}</div>}{p?.reference&&<div className="text-sm mt-1">مرجع الدفع: {p.reference}</div>}</div><div className="flex flex-wrap items-center gap-2"><span className="badge">{o.status==='CONFIRMED'?'مؤكد':o.status==='CANCELLED'?'ملغي':'في الانتظار'}</span>{o.status==='PENDING'&&p&&<><button disabled={busy===p.id} onClick={()=>act(p.id,'confirm')} className="btn btn-primary">تأكيد وفتح المحتوى</button><button disabled={busy===p.id} onClick={()=>act(p.id,'reject')} className="btn btn-secondary">رفض</button></>}{o.status==='CONFIRMED'&&p&&<button disabled={busy===p.id} onClick={()=>act(p.id,'refund')} className="btn btn-secondary">استرداد وإغلاق المحتوى</button>}</div></div></article>})}
          {!orders.length&&<div className="card p-10 text-center muted">لا توجد حجوزات حتى الآن.</div>}
        </div>
      </section>
    </div>
  </AdminShell>
}
