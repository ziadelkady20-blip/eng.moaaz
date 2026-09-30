'use client'

import DashboardShell from '@/components/DashboardShell'
import { useEffect, useState } from 'react'
import { UserRound, Phone, Hash, MapPin, GraduationCap, CalendarDays, School, Barcode, Save } from 'lucide-react'

const inputClass='w-full h-12 rounded-xl border border-[#eadfc9] bg-[#fffdf8] px-4 text-sm font-bold text-[#4a382a] outline-none transition focus:border-[#ef8b00] focus:ring-4 focus:ring-[#fff1c9]'

export default function Page(){
  const [data,setData]=useState<any>(null)
  const [form,setForm]=useState({name:'',guardianPhone:''})
  const [loading,setLoading]=useState(true)
  const [saving,setSaving]=useState(false)
  const [message,setMessage]=useState('')
  const [error,setError]=useState('')

  async function load(){
    setLoading(true);setError('')
    try{
      const r=await fetch('/api/student/profile',{cache:'no-store'})
      const d=await r.json().catch(()=>({}))
      if(!r.ok)throw new Error(d.error||'تعذر تحميل بيانات الملف الشخصي')
      setData(d);setForm({name:d.user?.name||'',guardianPhone:d.student?.guardianPhone||''})
    }catch(e){setError(e instanceof Error?e.message:'تعذر تحميل بيانات الملف الشخصي')}
    finally{setLoading(false)}
  }
  useEffect(()=>{load()},[])

  async function save(){
    setSaving(true);setMessage('');setError('')
    try{
      const r=await fetch('/api/student/profile',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)})
      const d=await r.json().catch(()=>({}))
      if(!r.ok)throw new Error(d.error||'تعذر حفظ التغييرات')
      setMessage('تم حفظ بياناتك بنجاح ✓');await load()
    }catch(e){setError(e instanceof Error?e.message:'تعذر حفظ التغييرات')}
    finally{setSaving(false)}
  }

  const student=data?.student
  const user=data?.user
  const studyType=student?.studyType==='ONLINE'?'أونلاين':student?.studyType==='CENTER'?'سنتر':student?.studyType==='HYBRID'?'هجين':'غير محدد'
  const grade=student?.grade?.name||'غير محدد'
  const studentId=student?.id||user?.id||'—'

  return <DashboardShell title="الملف الشخصي">
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div><h1 className="text-2xl font-black text-[#4a2b14]">الملف الشخصي</h1><p className="mt-1 text-xs font-bold text-[#8b7764]">بيانات الطالب المسجلة على المنصة</p></div>
        <div className="rounded-xl bg-[#fff3c8] p-3 text-[#a85c00]"><UserRound size={22}/></div>
      </div>

      {loading?<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{Array.from({length:6}).map((_,i)=><div key={i} className="h-28 animate-pulse rounded-2xl bg-[#f3ead7]"/>)}</div>:error?<div className="rounded-2xl border border-red-100 bg-red-50 p-7 text-center"><h2 className="text-lg font-black text-red-800">تعذر تحميل الملف الشخصي</h2><p className="mt-2 text-sm font-bold text-red-700">{error}</p><button onClick={load} className="mt-4 rounded-xl bg-[#ef8b00] px-5 py-3 text-sm font-black text-white">حاول مرة أخرى</button></div>:
      <>
        <section className="rounded-2xl border border-[#eee2c9] bg-white p-5 shadow-[0_10px_28px_rgba(92,56,20,.05)]">
          <div className="flex flex-col items-center gap-3 py-2 text-center">
            <div className="grid h-24 w-24 place-items-center overflow-hidden rounded-full border-4 border-[#fff3c8] bg-[#fff8e7] text-3xl font-black text-[#a85c00]">{user?.name?.[0]||'ط'}</div>
            <h2 className="text-lg font-black text-[#4a2b14]">{user?.name||'الطالب'}</h2>
            <p className="text-xs font-bold text-[#8b7764]">ID: {studentId}</p>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <InfoCard icon={<UserRound size={18}/>} label="الاسم" value={user?.name||'غير محدد'}/>
          <InfoCard icon={<Phone size={18}/>} label="رقم الهاتف" value={user?.phone||'غير محدد'}/>
          <InfoCard icon={<Hash size={18}/>} label="كود الطالب" value={studentId}/>
          <InfoCard icon={<MapPin size={18}/>} label="المحافظة" value={student?.governorate?.name||'غير محدد'}/>
          <InfoCard icon={<School size={18}/>} label="اسم المدرسة" value={student?.school?.name||'غير محددة'}/>
          <InfoCard icon={<GraduationCap size={18}/>} label="الصف الدراسي" value={grade}/>
          <InfoCard icon={<CalendarDays size={18}/>} label="نوع الدراسة" value={studyType}/>
          <InfoCard icon={<UserRound size={18}/>} label="الجنس" value={student?.gender==='MALE'?'ذكر':student?.gender==='FEMALE'?'أنثى':'غير محدد'}/>
          <InfoCard icon={<CalendarDays size={18}/>} label="تاريخ التسجيل" value={student?.createdAt?new Date(student.createdAt).toLocaleDateString('ar-EG'):'—'}/>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1fr_260px]">
          <div className="rounded-2xl border border-[#eee2c9] bg-white p-5 shadow-[0_10px_28px_rgba(92,56,20,.05)]">
            <div className="mb-4 flex items-center gap-2"><UserRound size={18} className="text-[#ef8b00]"/><h2 className="font-black text-[#4a2b14]">بيانات قابلة للتعديل</h2></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label><span className="mb-2 block text-xs font-black text-[#6e5844]">الاسم</span><input className={inputClass} value={form.name} onChange={e=>setForm(v=>({...v,name:e.target.value}))}/></label>
              <label><span className="mb-2 block text-xs font-black text-[#6e5844]">رقم ولي الأمر</span><input className={inputClass} value={form.guardianPhone} onChange={e=>setForm(v=>({...v,guardianPhone:e.target.value}))} placeholder="01XXXXXXXXX"/></label>
            </div>
            <button disabled={saving} onClick={save} className="mt-4 inline-flex h-11 items-center gap-2 rounded-xl bg-[#ef8b00] px-6 text-sm font-black text-white shadow-[0_8px_18px_rgba(239,139,0,.18)] disabled:opacity-60"><Save size={16}/>{saving?'جارٍ الحفظ...':'حفظ التعديلات'}</button>
            {message&&<div className="mt-3 rounded-xl bg-[#fff3c8] px-4 py-3 text-sm font-black text-[#8a5200]">{message}</div>}
            {error&&<div className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm font-black text-red-700">{error}</div>}
          </div>

          <div className="rounded-2xl border border-[#eee2c9] bg-white p-5 text-center shadow-[0_10px_28px_rgba(92,56,20,.05)]">
            <div className="mx-auto grid h-10 w-10 place-items-center rounded-xl bg-[#fff3c8] text-[#a85c00]"><Barcode size={20}/></div>
            <p className="mt-3 text-xs font-black text-[#8b7764]">باركود الطالب</p>
            <div className="mx-auto mt-4 max-w-[190px] rounded-xl border border-[#eadfc9] bg-[#fffdf8] p-4">
              <div className="flex h-16 items-end justify-center gap-[2px] overflow-hidden">{Array.from({length:38}).map((_,i)=><span key={i} className="block bg-[#34271e]" style={{width:i%5===0?'3px':'2px',height:`${42+(i*13)%22}px`}}/>)}</div>
              <strong className="mt-2 block tracking-[5px] text-sm text-[#34271e]">{String(studentId).slice(-8)}</strong>
            </div>
            <p className="mt-3 text-[10px] font-bold text-[#a08b76]">استخدم كود الطالب للتواصل مع الإدارة</p>
          </div>
        </section>
      </>}
    </div>
  </DashboardShell>
}

function InfoCard({icon,label,value}:{icon:React.ReactNode;label:string;value:string}){
  return <div className="rounded-2xl border border-[#eee2c9] bg-white p-4 shadow-[0_8px_22px_rgba(92,56,20,.04)]"><div className="flex items-center gap-2 text-[#ef8b00]">{icon}<span className="text-[11px] font-black text-[#8b7764]">{label}</span></div><p className="mt-2 truncate text-sm font-black text-[#4a382a]">{value}</p></div>
}
