'use client'

import DashboardShell from '@/components/DashboardShell'
import { useEffect, useState } from 'react'

const inputClass = 'w-full h-12 rounded-2xl border border-[#e8e0ef] bg-white px-4 text-sm font-bold text-[#30263d] outline-none transition focus:border-[#6d2fa3] focus:ring-4 focus:ring-[#f0e7fb]'

export default function Page() {
  const [data, setData] = useState<any>(null)
  const [form, setForm] = useState({ name: '', guardianPhone: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function load() {
    setLoading(true)
    setError('')
    try {
      const r = await fetch('/api/student/profile', { cache: 'no-store' })
      const d = await r.json().catch(() => ({}))
      if (!r.ok) throw new Error(d.error || 'تعذر تحميل بيانات الملف الشخصي')
      setData(d)
      setForm({ name: d.user?.name || '', guardianPhone: d.student?.guardianPhone || '' })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'تعذر تحميل بيانات الملف الشخصي')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function save() {
    setSaving(true)
    setMessage('')
    setError('')
    try {
      const r = await fetch('/api/student/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const d = await r.json().catch(() => ({}))
      if (!r.ok) throw new Error(d.error || 'تعذر حفظ التغييرات')
      setMessage('تم حفظ بياناتك بنجاح ✓')
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'تعذر حفظ التغييرات')
    } finally {
      setSaving(false)
    }
  }

  const student = data?.student
  const user = data?.user
  const studyType = student?.studyType === 'ONLINE' ? 'أونلاين' : student?.studyType === 'CENTER' ? 'سنتر' : student?.studyType === 'HYBRID' ? 'هجين' : 'غير محدد'

  return (
    <DashboardShell title="الملف الشخصي">
      <div className="space-y-6">
        <section className="rounded-[28px] border border-[#eee7f4] bg-gradient-to-br from-white via-[#fbf8ff] to-[#f4ecfb] p-6 sm:p-8 shadow-[0_16px_45px_rgba(58,29,85,.07)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="inline-flex rounded-full border border-[#dfcdef] bg-[#f4ecfb] px-3 py-1 text-xs font-black text-[#6d2fa3]">حساب الطالب</span>
              <h1 className="mt-3 text-3xl sm:text-4xl font-black text-[#292238]">بياناتك الشخصية</h1>
              <p className="mt-2 text-sm font-semibold text-[#746f80]">كل البيانات التالية مأخوذة من حسابك المسجل في المنصة.</p>
            </div>
            <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-[#6d2fa3] text-2xl font-black text-white shadow-[0_12px_26px_rgba(109,47,163,.22)]">{user?.name?.[0] || 'ط'}</div>
          </div>
        </section>

        {loading ? (
          <div className="grid gap-6 lg:grid-cols-2">
            {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-24 animate-pulse rounded-2xl bg-[#f0ebf5]" />)}
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-100 bg-red-50 p-8 text-center">
            <h2 className="text-xl font-black text-red-800">تعذر تحميل الملف الشخصي</h2>
            <p className="mt-2 text-sm font-bold text-red-700">{error}</p>
            <button onClick={load} className="mt-5 rounded-xl bg-[#6d2fa3] px-5 py-3 text-sm font-black text-white">حاول مرة أخرى</button>
          </div>
        ) : (
          <>
            <section className="rounded-[28px] border border-[#eee7f4] bg-white p-6 sm:p-8 shadow-[0_14px_36px_rgba(45,25,65,.06)]">
              <div className="mb-6 flex items-center justify-between gap-3">
                <div><h2 className="text-xl font-black text-[#292238]">معلومات أساسية</h2><p className="mt-1 text-xs font-semibold text-[#7a7484]">المعلومات المرتبطة بالحساب والتسجيل.</p></div>
                <span className="rounded-full bg-[#f4ecfb] px-3 py-1 text-xs font-black text-[#6d2fa3]">بيانات حقيقية</span>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <label><span className="mb-2 block text-sm font-black">الاسم</span><input className={inputClass} value={form.name} onChange={e => setForm(v => ({ ...v, name: e.target.value }))} /></label>
                <label><span className="mb-2 block text-sm font-black">رقم الهاتف</span><input className={`${inputClass} bg-[#faf8fc]`} value={user?.phone || ''} readOnly /></label>
                <label><span className="mb-2 block text-sm font-black">الصف الدراسي</span><input className={`${inputClass} bg-[#faf8fc]`} value={student?.grade?.name || 'غير محدد'} readOnly /></label>
                <label><span className="mb-2 block text-sm font-black">المحافظة</span><input className={`${inputClass} bg-[#faf8fc]`} value={student?.governorate?.name || 'غير محدد'} readOnly /></label>
                <label><span className="mb-2 block text-sm font-black">المدرسة</span><input className={`${inputClass} bg-[#faf8fc]`} value={student?.school?.name || 'غير محددة'} readOnly /></label>
                <label><span className="mb-2 block text-sm font-black">نوع الدراسة</span><input className={`${inputClass} bg-[#faf8fc]`} value={studyType} readOnly /></label>
                <label className="md:col-span-2"><span className="mb-2 block text-sm font-black">رقم ولي الأمر</span><input className={inputClass} value={form.guardianPhone} onChange={e => setForm(v => ({ ...v, guardianPhone: e.target.value }))} placeholder="مثال: 01XXXXXXXXX" /></label>
              </div>

              <div className="mt-6 flex flex-col gap-3 border-t border-[#eee7f4] pt-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="rounded-2xl bg-[#faf7fc] px-4 py-3 text-xs font-bold text-[#746f80]">كلمة المرور: محفوظة بأمان ولا يتم عرضها داخل المنصة.</div>
                <button disabled={saving} onClick={save} className="h-12 rounded-2xl bg-[#6d2fa3] px-7 text-sm font-black text-white shadow-[0_10px_24px_rgba(109,47,163,.18)] disabled:cursor-not-allowed disabled:opacity-60">{saving ? 'جارٍ الحفظ...' : 'حفظ التعديلات'}</button>
              </div>
              {message && <div className="mt-4 rounded-2xl bg-[#edf9f1] px-4 py-3 text-sm font-black text-[#16713a]">{message}</div>}
              {error && <div className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-black text-red-700">{error}</div>}
            </section>

            <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <InfoCard label="حالة الحساب" value="نشط" />
              <InfoCard label="الدور" value="طالب" />
              <InfoCard label="نوع الدراسة" value={studyType} />
              <InfoCard label="الوصول للمحتوى" value="حسب الاشتراك" />
            </section>
          </>
        )}
      </div>
    </DashboardShell>
  )
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return <div className="rounded-3xl border border-[#eee7f4] bg-white p-5 shadow-[0_10px_28px_rgba(45,25,65,.05)]"><p className="text-xs font-bold text-[#81798d]">{label}</p><p className="mt-2 text-lg font-black text-[#292238]">{value}</p></div>
}
