'use client'

import AdminShell from '@/components/AdminShell'
import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, BookOpen, Check, KeyRound, Loader2, Lock, Save, Shield, Trash2, UserRound, Users, X } from 'lucide-react'
import Link from 'next/link'

const input='w-full rounded-2xl border border-[#e8e2eb] bg-[#fcfbfe] px-4 py-3 text-sm font-bold outline-none transition focus:border-[var(--primary)] focus:bg-white'
const btn='inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-black transition disabled:cursor-not-allowed disabled:opacity-50'

export default function AdminUserDetails({params}:{params:Promise<{id:string}>}){
 const [id,setId]=useState('')
 const [user,setUser]=useState<any>(null)
 const [courses,setCourses]=useState<any[]>([])
 const [lessons,setLessons]=useState<any[]>([])
 const [grades,setGrades]=useState<any[]>([])
 const [tab,setTab]=useState<'account'|'courses'|'lessons'>('account')
 const [courseSearch,setCourseSearch]=useState('')
 const [lessonSearch,setLessonSearch]=useState('')
 const [form,setForm]=useState<any>({name:'',phone:'',password:'',role:'STUDENT',gradeId:'',guardianPhone:'',studyType:'ONLINE'})
 const [loading,setLoading]=useState(true)
 const [busy,setBusy]=useState(false)
 const [message,setMessage]=useState('')
 const [error,setError]=useState('')

 useEffect(()=>{params.then(p=>setId(p.id))},[params])
 const load=async()=>{
  if(!id)return
  setLoading(true);setError('')
  try{
   const [u,c,l,m]=await Promise.all([
    fetch(`/api/admin/users/${id}`,{cache:'no-store'}),
    fetch(`/api/admin/users/${id}/courses`,{cache:'no-store'}),
    fetch(`/api/admin/users/${id}/lessons`,{cache:'no-store'}),
    fetch('/api/admin/meta',{cache:'no-store'}),
   ])
   const [ud,cd,ld,md]=await Promise.all([u.json(),c.json(),l.json(),m.json()])
   if(!u.ok)throw Error(ud.error||'تعذر تحميل الحساب')
   setUser(ud.user);setCourses(cd.courses||[]);setLessons(ld.lessons||[]);setGrades(md.grades||[])
   const s=ud.user.student
   setForm({name:ud.user.name,phone:ud.user.phone,password:'',role:ud.user.role,gradeId:s?.gradeId||'',guardianPhone:s?.guardianPhone||'',studyType:s?.studyType||'ONLINE'})
  }catch(e:any){setError(e.message||'تعذر تحميل الحساب')}finally{setLoading(false)}
 }
 useEffect(()=>{load()},[id])

 const filteredCourses=useMemo(()=>courses.filter(c=>(c.title||'').toLowerCase().includes(courseSearch.toLowerCase())||(c.grade?.name||'').includes(courseSearch)),[courses,courseSearch])
 const filteredLessons=useMemo(()=>lessons.filter(l=>`${l.title} ${l.module?.title||''} ${l.module?.course?.title||''}`.toLowerCase().includes(lessonSearch.toLowerCase())),[lessons,lessonSearch])

 async function saveAccount(e:any){
  e.preventDefault();setBusy(true);setMessage('');setError('')
  try{
   const r=await fetch(`/api/admin/users/${id}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)})
   const d=await r.json();if(!r.ok)throw Error(d.error)
   setMessage('تم حفظ بيانات الحساب وكلمة المرور بنجاح');setForm({...form,password:''});await load()
  }catch(e:any){setError(e.message||'تعذر حفظ البيانات')}finally{setBusy(false)}
 }
 async function toggle(url:string,body:any,success:string){
  setBusy(true);setMessage('');setError('')
  try{const r=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});const d=await r.json();if(!r.ok)throw Error(d.error);setMessage(success);await load()}catch(e:any){setError(e.message||'تعذر تنفيذ العملية')}finally{setBusy(false)}
 }
 async function deleteAccount(){
  if(!confirm(`هل أنت متأكد من حذف حساب ${user?.name||'هذا المستخدم'}؟ سيتم حذف بيانات الحساب المرتبطة به ولا يمكن التراجع.`))return
  setBusy(true);setError('')
  try{const r=await fetch(`/api/admin/users/${id}`,{method:'DELETE'});const d=await r.json();if(!r.ok)throw Error(d.error);location.href='/admin/users'}catch(e:any){setError(e.message||'تعذر حذف الحساب')}finally{setBusy(false)}
 }
 if(loading)return <AdminShell><div className="card p-10 text-center font-black">جاري تحميل بيانات الحساب…</div></AdminShell>
 if(!user)return <AdminShell><div className="card p-10 text-center font-black">الحساب غير موجود</div></AdminShell>

 return <AdminShell><div className="space-y-6 pb-12">
  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
   <div className="flex items-center gap-3"><Link href="/admin/users" className={`${btn} border border-[#e7e0ea] bg-white text-[var(--ink)]`}><ArrowRight size={17}/> المستخدمون</Link><div><div className="text-xs font-black text-[var(--muted)]">إدارة حساب كاملة</div><h1 className="mt-1 text-3xl font-black">{user.name}</h1></div></div>
   <button onClick={deleteAccount} disabled={busy} className={`${btn} bg-red-50 text-red-600 hover:bg-red-100`}><Trash2 size={17}/> حذف الحساب</button>
  </div>

  {message&&<div className="rounded-2xl border border-green-100 bg-green-50 p-4 text-sm font-black text-green-700">✓ {message}</div>}
  {error&&<div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-black text-red-700">⚠️ {error}</div>}

  <section className="card overflow-hidden p-2">
   <div className="grid grid-cols-3 gap-2">
    {[['account','بيانات الحساب',UserRound],['courses','الكورسات',BookOpen],['lessons','صلاحيات الدروس',Lock]].map(([key,label,Icon]:any)=><button key={key} onClick={()=>setTab(key)} className={`flex items-center justify-center gap-2 rounded-2xl px-3 py-3 text-sm font-black transition ${tab===key?'bg-[var(--primary)] text-white shadow-lg':'text-[var(--ink)] hover:bg-[var(--primary-soft)]'}`}><Icon size={17}/>{label}</button>)}
   </div>
  </section>

  {tab==='account'&&<div className="grid gap-6 lg:grid-cols-[1fr_340px]">
   <form onSubmit={saveAccount} className="card space-y-5 p-6">
    <div><h2 className="text-xl font-black">تعديل بيانات الحساب</h2><p className="mt-1 text-sm font-bold text-[var(--muted)]">غيّر أي بيانات تخص الطالب مباشرة من هنا.</p></div>
    <div className="grid gap-4 md:grid-cols-2">
     <label className="space-y-2"><span className="text-xs font-black">الاسم</span><input className={input} value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></label>
     <label className="space-y-2"><span className="text-xs font-black">رقم الهاتف</span><input className={input} value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/></label>
     <label className="space-y-2"><span className="text-xs font-black">الصلاحية</span><select className={input} value={form.role} onChange={e=>setForm({...form,role:e.target.value})}>{[['STUDENT','طالب'],['PARENT','ولي أمر'],['TEACHER','مدرس'],['SUPPORT','دعم'],['ADMIN','مدير']].map(x=><option key={x[0]} value={x[0]}>{x[1]}</option>)}</select></label>
     {user.student&&<label className="space-y-2"><span className="text-xs font-black">الصف</span><select className={input} value={form.gradeId} onChange={e=>setForm({...form,gradeId:e.target.value})}><option value="">بدون صف</option>{grades.map(g=><option key={g.id} value={g.id}>{g.name}</option>)}</select></label>}
     {user.student&&<label className="space-y-2"><span className="text-xs font-black">رقم ولي الأمر</span><input className={input} value={form.guardianPhone} onChange={e=>setForm({...form,guardianPhone:e.target.value})}/></label>}
     {user.student&&<label className="space-y-2"><span className="text-xs font-black">نوع الدراسة</span><select className={input} value={form.studyType} onChange={e=>setForm({...form,studyType:e.target.value})}><option value="ONLINE">أونلاين</option><option value="CENTER">سنتر</option><option value="HYBRID">مختلط</option></select></label>}
     <label className="space-y-2 md:col-span-2"><span className="text-xs font-black">تعيين كلمة مرور جديدة</span><div className="relative"><KeyRound className="absolute right-4 top-3.5 text-[var(--muted)]" size={17}/><input className={`${input} pr-11`} type="password" minLength={8} placeholder="اتركها فارغة لعدم تغييرها" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/></div></label>
    </div>
    <button disabled={busy} className={`${btn} w-full bg-[var(--primary)] text-white shadow-[0_10px_25px_rgba(109,47,163,.18)]`}>{busy?<Loader2 className="animate-spin" size={17}/>:<Save size={17}/>} حفظ التعديلات</button>
   </form>
   <div className="card p-6"><div className="mb-5 flex items-center gap-3"><div className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)]"><Shield size={23}/></div><div><div className="font-black">ملخص الحساب</div><div className="text-xs font-bold text-[var(--muted)]">صلاحيات وتحكم الإدارة</div></div></div><div className="space-y-3 text-sm"><div className="flex justify-between"><span className="text-[var(--muted)]">الدور</span><b>{user.role}</b></div><div className="flex justify-between"><span className="text-[var(--muted)]">الهاتف</span><b dir="ltr">{user.phone}</b></div><div className="flex justify-between"><span className="text-[var(--muted)]">الكورسات</span><b>{courses.filter(c=>c.enrolled).length}</b></div><div className="flex justify-between"><span className="text-[var(--muted)]">دروس مضافة مباشرة</span><b>{lessons.filter(l=>l.assigned).length}</b></div></div></div>
  </div>}

  {tab==='courses'&&<section className="card p-6">
   <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><div><h2 className="text-xl font-black">إدارة كورسات الطالب</h2><p className="mt-1 text-sm font-bold text-[var(--muted)]">أضف أو احذف صلاحية أي كورس لهذا الحساب بدون تغيير سعر الكورس.</p></div><input className={`${input} md:w-80`} placeholder="ابحث عن كورس…" value={courseSearch} onChange={e=>setCourseSearch(e.target.value)}/></div>
   <div className="grid gap-3">{filteredCourses.map(c=><div key={c.id} className="flex flex-col gap-3 rounded-2xl border border-[#eee8f1] p-4 md:flex-row md:items-center md:justify-between"><div><div className="font-black">{c.title}</div><div className="mt-1 text-xs font-bold text-[var(--muted)]">{c.grade?.name||'—'} · {c.subject?.name||'—'} · {c._count?.modules||0} وحدات</div></div><button disabled={busy} onClick={()=>toggle(`/api/admin/users/${id}/courses`,{courseId:c.id,action:c.enrolled?'remove':'add'},c.enrolled?'تم حذف الكورس من حساب الطالب':'تمت إضافة الكورس لحساب الطالب')} className={`${btn} ${c.enrolled?'border border-red-100 bg-red-50 text-red-600':'bg-[var(--primary)] text-white'}`}>{c.enrolled?<><X size={16}/> إزالة الكورس</>:<><Check size={16}/> إضافة للطالب</>}</button></div>)}{!filteredCourses.length&&<div className="py-10 text-center font-bold text-[var(--muted)]">لا توجد نتائج.</div>}</div>
  </section>}

  {tab==='lessons'&&<section className="card p-6">
   <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><div><h2 className="text-xl font-black">صلاحيات الدروس الفردية</h2><p className="mt-1 text-sm font-bold text-[var(--muted)]">يمكنك فتح درس محدد للطالب حتى لو لم يشترِ الكورس أو لم يكن مشتركًا فيه.</p></div><input className={`${input} md:w-80`} placeholder="ابحث عن درس أو كورس…" value={lessonSearch} onChange={e=>setLessonSearch(e.target.value)}/></div>
   <div className="grid gap-3">{filteredLessons.map(l=><div key={l.id} className="flex flex-col gap-3 rounded-2xl border border-[#eee8f1] p-4 md:flex-row md:items-center md:justify-between"><div><div className="font-black">{l.title}</div><div className="mt-1 text-xs font-bold text-[var(--muted)]">{l.module?.course?.title||'—'} · {l.module?.title||'—'} · {l.module?.course?.grade?.name||'—'}</div></div><button disabled={busy} onClick={()=>toggle(`/api/admin/users/${id}/lessons`,{lessonId:l.id,action:l.assigned?'remove':'add'},l.assigned?'تم حذف الدرس من حساب الطالب':'تم فتح الدرس للطالب')} className={`${btn} ${l.assigned?'border border-red-100 bg-red-50 text-red-600':'bg-[var(--primary)] text-white'}`}>{l.assigned?<><X size={16}/> إزالة من الطالب</>:<><Check size={16}/> إضافة للطالب</>}</button></div>)}{!filteredLessons.length&&<div className="py-10 text-center font-bold text-[var(--muted)]">لا توجد نتائج.</div>}</div>
  </section>}
 </div></AdminShell>
}
