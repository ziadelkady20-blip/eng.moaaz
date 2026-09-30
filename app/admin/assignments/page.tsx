'use client'

import AdminShell from '@/components/AdminShell'
import { upload } from '@vercel/blob/client'
import { useEffect, useMemo, useState } from 'react'
import { CheckCircle2, ClipboardCheck, Edit3, FileText, RefreshCw, Trash2, UploadCloud } from 'lucide-react'

const input = 'w-full rounded-2xl border border-[#e6e1ee] bg-white px-4 py-3.5 text-sm font-semibold outline-none transition focus:border-[#f28a00] focus:ring-4 focus:ring-[#fff0dc]'
const primary = 'inline-flex items-center justify-center gap-2 rounded-2xl bg-[#f28a00] px-5 py-3.5 text-sm font-black text-white shadow-[0_10px_24px_rgba(242,138,0,.18)] transition hover:-translate-y-0.5 hover:bg-[#df7d00] disabled:opacity-50'

function nextWeekLocal() {
  const d = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export default function AdminAssignments() {
  const [meta, setMeta] = useState<any>({ lessons: [] })
  const [assignments, setAssignments] = useState<any[]>([])
  const [form, setForm] = useState({ lessonId: '', title: '', description: '', dueAt: nextWeekLocal(), fileUrl: '' })
  const [editing, setEditing] = useState<any>(null)
  const [file, setFile] = useState<File | null>(null)
  const [progress, setProgress] = useState(0)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const lessons = useMemo(() => meta.lessons || [], [meta.lessons])

  async function load() {
    setError('')
    try {
      const [m, a] = await Promise.all([
        fetch('/api/admin/meta', { cache: 'no-store' }),
        fetch('/api/admin/assignments', { cache: 'no-store' }),
      ])
      const md = await m.json()
      const ad = await a.json()
      if (!m.ok) throw new Error(md.error)
      if (!a.ok) throw new Error(ad.error)
      setMeta(md)
      setAssignments(ad.assignments || [])
      if (!form.lessonId && md.lessons?.[0]) setForm((x) => ({ ...x, lessonId: md.lessons[0].id }))
    } catch (e: any) {
      setError(e.message || 'تعذر تحميل الواجبات')
    }
  }

  useEffect(() => { load() }, [])

  function startEdit(a: any) {
    setEditing(a)
    setForm({
      lessonId: a.lessonId || '',
      title: a.title || '',
      description: a.description || '',
      dueAt: new Date(a.dueAt).toISOString().slice(0, 16),
      fileUrl: a.fileUrl || '',
    })
    setFile(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function resetForm() {
    setEditing(null)
    setFile(null)
    setProgress(0)
    setForm({ lessonId: lessons[0]?.id || '', title: '', description: '', dueAt: nextWeekLocal(), fileUrl: '' })
  }

  async function uploadPdf() {
    if (!file) return form.fileUrl
    if (file.type !== 'application/pdf') throw new Error('مسموح برفع PDF فقط')
    if (file.size > 20 * 1024 * 1024) throw new Error('حجم ملف الواجب يجب ألا يتجاوز 20 ميجابايت')
    const blob = await upload(`assignments/source/${crypto.randomUUID()}.pdf`, file, {
      access: 'private',
      handleUploadUrl: '/api/blob/upload',
      multipart: true,
      clientPayload: JSON.stringify({ purpose: 'ASSIGNMENT' }),
      onUploadProgress(event) { setProgress(Math.round(event.percentage)) },
    })
    return blob.url
  }

  async function save(e: any) {
    e.preventDefault()
    setBusy(true); setError(''); setMessage(''); setProgress(0)
    try {
      if (!form.lessonId || !form.title.trim()) throw new Error('اختر الحصة واكتب اسم الواجب')
      const fileUrl = await uploadPdf()
      const url = editing ? `/api/admin/assignments/${editing.id}` : '/api/admin/assignments'
      const r = await fetch(url, {
        method: editing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, fileUrl: fileUrl || form.fileUrl }),
      })
      const d = await r.json()
      if (!r.ok) throw new Error(d.error || 'تعذر حفظ الواجب')
      setMessage(editing ? 'تم تعديل الواجب بنجاح' : 'تم إنشاء الواجب ورفع ملف الـPDF بنجاح')
      resetForm()
      await load()
    } catch (e: any) {
      setError(e.message || 'تعذر حفظ الواجب')
    } finally {
      setBusy(false)
    }
  }

  async function remove(id: string) {
    if (!confirm('هل تريد حذف هذا الواجب؟')) return
    setBusy(true); setError(''); setMessage('')
    try {
      const r = await fetch(`/api/admin/assignments/${id}`, { method: 'DELETE' })
      const d = await r.json()
      if (!r.ok) throw new Error(d.error)
      setMessage('تم حذف الواجب')
      await load()
    } catch (e: any) {
      setError(e.message || 'تعذر حذف الواجب')
    } finally { setBusy(false) }
  }

  return <AdminShell>
    <div className="space-y-6 pb-10" dir="rtl">
      <section className="overflow-hidden rounded-[30px] border border-[#ebe4db] bg-white p-7 shadow-[0_16px_45px_rgba(36,33,58,.06)]">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4"><div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#fff1df] text-[#f28a00]"><ClipboardCheck size={25}/></div><div><div className="text-xs font-black text-[#f28a00]">إدارة الواجبات</div><h1 className="mt-1 text-3xl font-black text-[#182338]">واجبات الحصص</h1><p className="mt-1 text-sm font-semibold text-[#777b84]">اربط كل واجب بحصة محددة وارفع ورقة الواجب PDF مباشرة.</p></div></div>
          <button onClick={load} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#e7e0d8] px-5 py-3 text-sm font-black text-[#243047] hover:bg-[#fffaf4]"><RefreshCw size={16}/> تحديث</button>
        </div>
      </section>

      {message && <div className="rounded-2xl border border-green-100 bg-green-50 p-4 text-sm font-bold text-green-700"><CheckCircle2 className="ml-2 inline" size={17}/>{message}</div>}
      {error && <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-700">⚠️ {error}</div>}

      <section className="rounded-[28px] border border-[#ebe4db] bg-white p-6 shadow-[0_12px_35px_rgba(30,36,45,.05)]">
        <div className="mb-5 flex items-center justify-between gap-3"><div><h2 className="text-xl font-black text-[#182338]">{editing ? 'تعديل الواجب' : 'إضافة واجب جديد'}</h2><p className="mt-1 text-xs font-semibold text-[#858991]">الملف يجب أن يكون PDF وبحد أقصى 20 ميجابايت.</p></div>{editing && <button onClick={resetForm} className="rounded-xl bg-[#f6f3ee] px-4 py-2 text-xs font-black">إلغاء التعديل</button>}</div>
        <form onSubmit={save} className="space-y-4">
          <select className={input} value={form.lessonId} onChange={(e)=>setForm({...form,lessonId:e.target.value})} required><option value="">اختر الحصة</option>{lessons.map((l:any)=><option key={l.id} value={l.id}>{l.module?.course?.title || 'كورس'} — {l.module?.title || 'وحدة'} — {l.title}</option>)}</select>
          <div className="grid gap-4 md:grid-cols-2"><input className={input} placeholder="اسم الواجب" value={form.title} onChange={(e)=>setForm({...form,title:e.target.value})} required/><input className={input} type="datetime-local" value={form.dueAt} onChange={(e)=>setForm({...form,dueAt:e.target.value})} required/></div>
          <textarea className={input+' min-h-28'} placeholder="وصف الواجب / التعليمات" value={form.description} onChange={(e)=>setForm({...form,description:e.target.value})}/>
          <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border-2 border-dashed border-[#e4ddd4] bg-[#fcfaf7] p-5 hover:border-[#f28a00]">
            <div className="flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-xl bg-white text-[#f28a00] shadow-sm"><UploadCloud size={20}/></div><div><div className="text-sm font-black text-[#243047]">{file ? file.name : editing?.fileUrl ? 'استبدال ملف الـPDF الحالي' : 'اختيار ملف الواجب PDF'}</div><div className="mt-1 text-xs font-semibold text-[#858991]">PDF فقط • حتى 20MB</div></div></div>
            <input type="file" accept="application/pdf,.pdf" className="hidden" onChange={(e)=>setFile(e.target.files?.[0] || null)}/><span className="rounded-xl bg-[#fff1df] px-4 py-2 text-xs font-black text-[#e17b00]">اختيار ملف</span>
          </label>
          {busy && progress > 0 && <div><div className="mb-1 flex justify-between text-xs font-black text-[#777b84]"><span>رفع الملف</span><span>{progress}%</span></div><div className="h-2 overflow-hidden rounded-full bg-[#eee8df]"><div className="h-full rounded-full bg-[#f28a00] transition-all" style={{width:`${progress}%`}}/></div></div>}
          <button disabled={busy} className={primary}>{busy ? 'جارٍ الحفظ والرفع...' : editing ? 'حفظ التعديلات' : 'إنشاء الواجب ورفع الـPDF'}</button>
        </form>
      </section>

      <section className="space-y-4">
        {assignments.map((a:any)=><article key={a.id} className="rounded-[26px] border border-[#ebe4db] bg-white p-5 shadow-[0_10px_30px_rgba(30,36,45,.045)]"><div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><div className="min-w-0"><div className="text-xs font-black text-[#f28a00]">{a.course?.title}</div><h3 className="mt-1 text-lg font-black text-[#182338]">{a.title}</h3><div className="mt-1 text-xs font-bold text-[#777b84]">الحصة: {a.lesson?.title || 'غير مرتبطة'} • التسليم: {new Date(a.dueAt).toLocaleString('ar-EG')}</div><div className="mt-3 flex flex-wrap gap-2 text-xs font-black"><span className="rounded-xl bg-[#f7f8fa] px-3 py-2 text-[#59616d]">{a.fileUrl ? 'PDF مرفوع' : 'بدون ملف'}</span><span className="rounded-xl bg-[#fff6e9] px-3 py-2 text-[#d87800]">{a.submissions?.length || 0} تسليم</span></div></div><div className="flex gap-2"><a href={a.fileUrl ? `/api/assignments/${a.id}/file` : '#'} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-[#e7e0d8] px-3 py-2.5 text-xs font-black text-[#243047] disabled:opacity-40"><FileText size={15}/> عرض PDF</a><button onClick={()=>startEdit(a)} className="inline-flex items-center gap-2 rounded-xl bg-[#fff1df] px-3 py-2.5 text-xs font-black text-[#e17b00]"><Edit3 size={15}/> تعديل</button><button onClick={()=>remove(a.id)} disabled={busy} className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2.5 text-xs font-black text-red-600"><Trash2 size={15}/> حذف</button></div></div></article>)}
        {!assignments.length && <div className="rounded-[26px] border border-dashed border-[#dcd5cd] bg-white p-12 text-center text-sm font-bold text-[#777b84]">لا توجد واجبات مضافة حتى الآن.</div>}
      </section>
    </div>
  </AdminShell>
}
