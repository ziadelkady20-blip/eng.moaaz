'use client'

import DashboardShell from '@/components/DashboardShell'
import { upload } from '@vercel/blob/client'
import { useEffect, useState } from 'react'
import { CheckCircle2, ClipboardCheck, Clock3, FileDown, FileText, RefreshCw, Send, UploadCloud } from 'lucide-react'

export default function Assignments() {
  const [data, setData] = useState<any>()
  const [busy, setBusy] = useState('')
  const [progress, setProgress] = useState<Record<string, number>>({})
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const load = async () => {
    setError('')
    const r = await fetch('/api/student/assignments', { cache: 'no-store' })
    const d = await r.json()
    if (!r.ok) return setError(d.error || 'تعذر تحميل الواجبات')
    setData(d)
  }

  useEffect(() => { load() }, [])

  async function submitPdf(assignmentId: string, file: File) {
    if (file.type !== 'application/pdf') return setError('مسموح برفع ملفات PDF فقط')
    if (file.size > 20 * 1024 * 1024) return setError('حجم الملف يجب ألا يتجاوز 20 ميجابايت')

    setBusy(assignmentId)
    setError('')
    setMessage('')
    setProgress((x) => ({ ...x, [assignmentId]: 0 }))

    try {
      const blob = await upload(`assignments/submissions/${crypto.randomUUID()}.pdf`, file, {
        access: 'private',
        handleUploadUrl: '/api/blob/upload',
        multipart: true,
        clientPayload: JSON.stringify({ purpose: 'SUBMISSION' }),
        onUploadProgress(event) {
          setProgress((x) => ({ ...x, [assignmentId]: Math.round(event.percentage) }))
        },
      })

      const response = await fetch(`/api/assignments/${assignmentId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileUrl: blob.url }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'تعذر تسليم الواجب')

      setData((current: any) => ({
        ...current,
        assignments: current.assignments.map((a: any) => a.id === assignmentId ? { ...a, submissions: [result.submission] } : a),
      }))
      setMessage('تم رفع ملف الحل وتسليمه بنجاح')
    } catch (e: any) {
      setError(e.message || 'تعذر رفع ملف الحل')
    } finally {
      setBusy('')
    }
  }

  if (!data) return <DashboardShell title="الواجبات"><div className="mx-auto max-w-6xl rounded-[28px] border border-[#e9e3dc] bg-white p-10 text-center font-bold">جاري تحميل الواجبات...</div></DashboardShell>

  return <DashboardShell title="الواجبات">
    <div className="mx-auto w-full max-w-6xl space-y-6 pb-12">
      <section className="overflow-hidden rounded-[30px] border border-[#eee8df] bg-white p-6 shadow-[0_16px_45px_rgba(30,36,45,.06)] md:p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#fff1df] text-[#f28a00]"><ClipboardCheck size={25}/></div>
            <div><div className="text-xs font-black text-[#f28a00]">مهامك الدراسية</div><h1 className="mt-1 text-3xl font-black text-[#182338]">واجباتي</h1><p className="mt-1 text-sm font-semibold text-[#777b84]">افتح ملف الحصة، حل الواجب، ثم ارفع نسخة الـPDF الخاصة بك.</p></div>
          </div>
          <button onClick={load} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#e8e1d8] bg-white px-5 py-3 text-sm font-black text-[#243047] hover:bg-[#fffaf4]"><RefreshCw size={16}/> تحديث</button>
        </div>
      </section>

      {message && <div className="rounded-2xl border border-green-100 bg-green-50 p-4 text-sm font-bold text-green-700">{message}</div>}
      {error && <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-700">{error}</div>}

      <div className="space-y-5">
        {(data.assignments || []).map((a: any) => {
          const sub = a.submissions?.[0]
          const hasFile = Boolean(a.fileUrl)
          const solved = Boolean(sub?.submittedAt)
          const pct = progress[a.id] || 0
          return <article key={a.id} className="overflow-hidden rounded-[28px] border border-[#ebe5dd] bg-white shadow-[0_12px_35px_rgba(30,36,45,.055)]">
            <div className="border-b border-[#f0ebe4] p-5 md:p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                  <div className="text-xs font-black text-[#f28a00]">{a.course?.title || 'الكورس'}</div>
                  <h2 className="mt-1 text-xl font-black text-[#182338]">{a.title}</h2>
                  {a.lesson && <div className="mt-1 text-xs font-bold text-[#7c8088]">الحصة: {a.lesson.title}</div>}
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[#646a74]">{a.description || 'حل الواجب المرفق ثم ارفع ملف الحل بصيغة PDF.'}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {solved ? <span className="inline-flex items-center gap-1.5 rounded-xl bg-green-50 px-3 py-2 text-xs font-black text-green-700"><CheckCircle2 size={15}/> تم التسليم</span> : <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#fff6e9] px-3 py-2 text-xs font-black text-[#e17b00]"><Clock3 size={15}/> مطلوب</span>}
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-bold text-[#777b84]">
                <span className="rounded-xl bg-[#faf7f2] px-3 py-2">موعد التسليم: {new Date(a.dueAt).toLocaleString('ar-EG')}</span>
                {a.fileUrl && <span className="rounded-xl bg-[#f7f8fa] px-3 py-2">ملف PDF مرفق</span>}
              </div>
            </div>

            {hasFile ? <div className="p-4 md:p-6">
              <div className="mb-3 flex items-center justify-between gap-3"><div className="flex items-center gap-2 text-sm font-black text-[#243047]"><FileText size={18} className="text-[#f28a00]"/> ورقة الواجب</div><a href={`/api/assignments/${a.id}/file`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-[#e7e0d8] px-3 py-2 text-xs font-black text-[#243047] hover:bg-[#fffaf4]"><FileDown size={15}/> فتح في تبويب</a></div>
              <iframe src={`/api/assignments/${a.id}/file`} title={a.title} className="h-[520px] w-full rounded-2xl border border-[#e7e1d9] bg-[#f7f7f7]" />
            </div> : <div className="mx-5 mt-5 rounded-2xl border border-dashed border-[#ddd6cd] bg-[#fcfaf7] p-5 text-center text-sm font-bold text-[#777b84]">لا يوجد ملف PDF مرفق بهذا الواجب.</div>}

            <div className="border-t border-[#f0ebe4] bg-[#fcfbf9] p-5 md:p-6">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><div><div className="text-sm font-black text-[#243047]">رفع ملف الحل</div><div className="mt-1 text-xs font-semibold text-[#7b7f87]">PDF فقط — الحد الأقصى 20 ميجابايت</div></div>{solved && <span className="text-xs font-bold text-green-700">تم حفظ آخر تسليم</span>}</div>
              <label className={`mt-4 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#e4ddd4] bg-white p-7 text-center transition hover:border-[#f28a00] hover:bg-[#fffaf4] ${busy===a.id?'pointer-events-none opacity-70':''}`}>
                <input type="file" accept="application/pdf,.pdf" className="hidden" onChange={(e)=>{const f=e.target.files?.[0];if(f)submitPdf(a.id,f);e.currentTarget.value=''}}/>
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#fff1df] text-[#f28a00]"><UploadCloud size={22}/></div>
                <div className="mt-3 text-sm font-black text-[#243047]">{busy===a.id?'جاري رفع الملف...':'اضغط لاختيار ملف الحل PDF'}</div>
                {busy===a.id && <div className="mt-4 h-2 w-full max-w-md overflow-hidden rounded-full bg-[#ece7e0]"><div className="h-full rounded-full bg-[#f28a00] transition-all" style={{width:`${pct}%`}}/></div>}
                {busy===a.id && <div className="mt-2 text-xs font-black text-[#f28a00]">{pct}%</div>}
              </label>
              {!solved && <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-[#8a8d94]"><Send size={14}/> بعد اكتمال الرفع يتم تسليم الواجب تلقائيًا.</div>}
            </div>
          </article>
        })}
        {!data.assignments.length && <div className="rounded-[28px] border border-dashed border-[#dcd5cd] bg-white p-12 text-center text-sm font-bold text-[#777b84]">لا توجد واجبات متاحة حاليًا.</div>}
      </div>
    </div>
  </DashboardShell>
}
