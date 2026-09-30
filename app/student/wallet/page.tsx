'use client'
import DashboardShell from '@/components/DashboardShell'
import { useEffect, useRef, useState } from 'react'

type WalletData = { balance:number; transactions:any[]; recharges:any[] }
const methods = [
  ['INSTAPAY','InstaPay','⚡'],
  ['VODAFONE_CASH','Vodafone Cash','◉'],
  ['ETISALAT_CASH','Etisalat Cash','◌'],
  ['ORANGE_CASH','Orange Cash','●'],
  ['BANK_TRANSFER','تحويل بنكي','▣'],
  ['OTHER','أخرى','＋'],
]
const MAX_PROOF_BYTES = 2 * 1024 * 1024

export default function WalletPage(){
  const [d,setD] = useState<WalletData>({balance:0,transactions:[],recharges:[]})
  const [loading,setLoading] = useState(true)
  const [sending,setSending] = useState(false)
  const [refreshing,setRefreshing] = useState(false)
  const [message,setMessage] = useState('')
  const [error,setError] = useState('')
  const [form,setForm] = useState({amount:'',method:'INSTAPAY',senderPhone:'',proof:null as File|null})
  const proofRef = useRef<HTMLInputElement>(null)

  const load = async()=>{
    try{
      setError('')
      const r = await fetch('/api/student/wallet',{cache:'no-store'})
      const x = await r.json()
      if(!r.ok) throw new Error(x.error || 'تعذر تحميل المحفظة')
      setD(x)
    }catch(e:any){ setError(e.message) }
    finally{ setLoading(false); setRefreshing(false) }
  }
  useEffect(()=>{ load() },[])
  async function refresh(){ setRefreshing(true); await load() }

  function chooseProof(file:File|null){
    setError('')
    if(!file){ setForm(f=>({...f,proof:null})); return }
    if(!file.type.startsWith('image/')){
      setForm(f=>({...f,proof:null}));
      if(proofRef.current) proofRef.current.value=''
      setError('إثبات التحويل يجب أن يكون صورة'); return
    }
    if(file.size>MAX_PROOF_BYTES){
      setForm(f=>({...f,proof:null}));
      if(proofRef.current) proofRef.current.value=''
      setError('حجم الصورة يجب ألا يتجاوز 2MB'); return
    }
    setForm(f=>({...f,proof:file}))
  }

  async function recharge(e:any){
    e.preventDefault(); setSending(true); setError(''); setMessage('')
    try{
      if(!form.proof) throw new Error('ارفع صورة إثبات التحويل')
      const amount = Number(form.amount)
      if(!Number.isFinite(amount)||amount<=0||amount>100000) throw new Error('أدخل مبلغ شحن صحيح')
      if(!/^01\d{9}$/.test(form.senderPhone.trim())) throw new Error('رقم الهاتف المحول منه مطلوب ويجب أن يكون صحيحًا')
      const fd = new FormData()
      fd.append('amount',form.amount); fd.append('method',form.method); fd.append('senderPhone',form.senderPhone.trim()); fd.append('proof',form.proof)
      const r = await fetch('/api/student/wallet/recharge',{method:'POST',body:fd,credentials:'same-origin'})
      const x = await r.json()
      if(!r.ok) throw new Error(x.error||'تعذر إرسال طلب الشحن')
      setMessage('تم إرسال طلب الشحن للمراجعة بنجاح.')
      setForm({amount:'',method:form.method,senderPhone:'',proof:null})
      if(proofRef.current) proofRef.current.value=''
      await load()
    }catch(e:any){ setError(e.message) }
    finally{ setSending(false) }
  }

  return <DashboardShell title="المحفظة">
    <div className="wallet-page space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="wallet-eyebrow">الحساب المالي</div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">المحفظة</h1>
          <p className="wallet-muted mt-2">اشحن رصيدك واشترِ الكورسات المتاحة لصفك بسهولة وأمان.</p>
        </div>
        <button type="button" onClick={refresh} disabled={loading||refreshing} className="wallet-refresh">
          <span className={refreshing?'wallet-spin':''}>↻</span>{refreshing?'جاري التحديث...':'تحديث الرصيد'}
        </button>
      </div>

      <div className="grid lg:grid-cols-[1.05fr_1.95fr] gap-5 items-stretch">
        <section className="wallet-balance-card">
          <div className="wallet-balance-top"><span>الرصيد المتاح</span><span className="wallet-lock">● آمن</span></div>
          <div className="wallet-balance-number">{loading?'—':d.balance.toFixed(2)} <small>ج.م</small></div>
          <div className="wallet-balance-line" />
          <div className="wallet-balance-bottom"><span>جاهز لشراء الكورسات</span><span>رصيدك يُحدّث بعد اعتماد التحويل</span></div>
        </section>

        <form onSubmit={recharge} className="wallet-card wallet-form">
          <div className="wallet-section-head">
            <div><h2>شحن المحفظة</h2><p>أرسل بيانات التحويل وسنراجع الطلب.</p></div>
            <div className="wallet-head-icon">+</div>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <label className="wallet-field md:col-span-1"><span>المبلغ</span><div className="wallet-input-wrap"><input required min="1" max="100000" step="0.01" type="number" placeholder="مثال: 100" value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})}/><b>ج.م</b></div></label>
            <label className="wallet-field"><span>رقم الهاتف المحول منه</span><input required type="tel" inputMode="numeric" pattern="01[0-9]{9}" maxLength={11} placeholder="01xxxxxxxxx" value={form.senderPhone} onChange={e=>setForm({...form,senderPhone:e.target.value.replace(/[^0-9]/g,'').slice(0,11)})}/></label>
          </div>
          <div className="wallet-field"><span>طريقة التحويل</span><div className="wallet-methods">{methods.map(x=><button key={x[0]} type="button" onClick={()=>setForm({...form,method:x[0]})} className={`wallet-method ${form.method===x[0]?'selected':''}`}><i>{x[2]}</i><span>{x[1]}</span></button>)}</div></div>
          <div className="wallet-field"><span>إثبات التحويل</span><label className={`wallet-upload ${form.proof?'has-file':''}`}><input ref={proofRef} required type="file" accept="image/*" onChange={e=>chooseProof(e.target.files?.[0]||null)}/><strong>{form.proof?'✓ تم اختيار صورة الإثبات':'↑ ارفع صورة إثبات التحويل'}</strong><small>{form.proof?form.proof.name:'PNG / JPG — الحد الأقصى 2MB'}</small></label></div>
          <button type="submit" disabled={sending} className="wallet-submit">{sending?'جاري إرسال الطلب...':'إرسال طلب الشحن'} <span>←</span></button>
          {message&&<div className="wallet-alert success">✓ {message}</div>}
          {error&&<div className="wallet-alert error">! {error}</div>}
        </form>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="wallet-mini"><span className="wallet-mini-icon">↗</span><div><small>طلبات الشحن</small><strong>{d.recharges.length}</strong></div></div>
        <div className="wallet-mini"><span className="wallet-mini-icon">↔</span><div><small>حركات المحفظة</small><strong>{d.transactions.length}</strong></div></div>
        <div className="wallet-mini"><span className="wallet-mini-icon">✓</span><div><small>حالة الحساب</small><strong>نشط</strong></div></div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <section className="wallet-card wallet-list-card">
          <div className="wallet-section-head"><div><h2>طلبات الشحن</h2><p>آخر عمليات شحن الرصيد.</p></div><span className="wallet-count">{d.recharges.length}</span></div>
          <div className="wallet-list">{d.recharges.map(r=><div key={r.id} className="wallet-row"><div className="wallet-row-icon">↑</div><div className="wallet-row-main"><b>{Number(r.amount).toFixed(2)} ج.م</b><small>{new Date(r.createdAt).toLocaleString('ar-EG')}</small></div><span className={`wallet-status ${r.status==='APPROVED'?'approved':r.status==='REJECTED'?'rejected':'pending'}`}>{r.status==='APPROVED'?'مقبول':r.status==='REJECTED'?'مرفوض':'قيد المراجعة'}</span></div>)}{!d.recharges.length&&<div className="wallet-empty"><span>○</span><b>لا توجد طلبات شحن</b><small>طلباتك الجديدة ستظهر هنا.</small></div>}</div>
        </section>
        <section className="wallet-card wallet-list-card">
          <div className="wallet-section-head"><div><h2>حركة المحفظة</h2><p>تفاصيل الإضافات والخصومات على الرصيد.</p></div><span className="wallet-count">{d.transactions.length}</span></div>
          <div className="wallet-list">{d.transactions.map(t=><div key={t.id} className="wallet-row"><div className={`wallet-row-icon ${Number(t.amount)<0?'minus':''}`}>{Number(t.amount)>=0?'↑':'↓'}</div><div className="wallet-row-main"><b>{t.description}</b><small>{new Date(t.createdAt).toLocaleString('ar-EG')}</small></div><strong className={Number(t.amount)>=0?'wallet-positive':'wallet-negative'}>{Number(t.amount)>=0?'+':''}{Number(t.amount).toFixed(2)} ج.م</strong></div>)}{!d.transactions.length&&<div className="wallet-empty"><span>○</span><b>لا توجد حركات حتى الآن</b><small>ستظهر هنا كل حركة على رصيدك.</small></div>}</div>
        </section>
      </div>
    </div>
  </DashboardShell>
}
