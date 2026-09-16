'use client'

import { useEffect, useState } from 'react'
import AdminShell from '@/components/AdminShell'

type FormState = Record<string, string>

const fields: Array<[keyof FormState, string, string, number]> = [
  ['brandName', 'اسم البراند', 'اسم البراند الظاهر في الواجهة', 80],
  ['siteName', 'اسم الموقع', 'العنوان التعريفي للموقع', 120],
  ['announcement', 'شريط الإعلان', 'اتركه فارغًا لإخفاء الشريط', 240],
  ['heroBadge', 'شارة الهيرو', 'النص الصغير فوق العنوان', 120],
  ['heroTitle', 'عنوان الهيرو', 'العنوان الرئيسي للصفحة', 180],
  ['heroDescription', 'وصف الهيرو', 'وصف قصير أسفل العنوان', 500],
  ['heroPrimaryLabel', 'زر الهيرو الأساسي', 'النص الظاهر على الزر', 60],
  ['heroPrimaryUrl', 'رابط الزر الأساسي', 'مثال: /register', 300],
  ['heroSecondaryLabel', 'زر الهيرو الثاني', 'النص الظاهر على الزر', 60],
  ['heroSecondaryUrl', 'رابط الزر الثاني', 'مثال: #stages', 300],
  ['footerText', 'نص الفوتر', 'حقوق النشر أو أي نص أساسي', 180],
  ['supportPhone', 'هاتف الدعم', 'رقم الهاتف الظاهر للدعم', 30],
  ['whatsapp', 'واتساب', 'رقم واتساب بدون + أو مسافات', 30],
  ['seoTitle', 'SEO Title', 'عنوان نتائج البحث', 180],
  ['seoDescription', 'SEO Description', 'وصف نتائج البحث', 300],
]

export default function WebsiteControlCenter() {
  const [form, setForm] = useState<FormState>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('/api/admin/site-settings')
      .then(async (r) => {
        const data = await r.json()
        if (!r.ok) throw new Error(data.error || 'غير مصرح')
        setForm(data.site)
      })
      .catch((e) => setMessage(e.message))
      .finally(() => setLoading(false))
  }, [])

  function update(key: string, value: string) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  async function save() {
    setSaving(true)
    setMessage('')
    try {
      const response = await fetch('/api/admin/site-settings', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'تعذر الحفظ')
      setForm(data.site)
      setMessage('تم حفظ إعدادات الموقع بنجاح ✅')
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'تعذر الحفظ')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminShell>
      <div className="flex items-start justify-between gap-4 mb-7">
        <div>
          <div className="badge">SUPER ADMIN</div>
          <h1 className="text-3xl font-black mt-3">Website Control Center</h1>
          <p className="muted mt-2">تحكم في الهوية، الهيرو، الإعلانات، الفوتر وSEO من مكان واحد.</p>
        </div>
        <button className="btn btn-primary" onClick={save} disabled={loading || saving}>
          {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
        </button>
      </div>

      {message && <div className="card p-4 mb-5 bg-[var(--primary-soft)] font-bold">{message}</div>}

      <div className="grid lg:grid-cols-2 gap-5">
        {fields.map(([key, label, placeholder, max]) => (
          <label key={key} className="card p-5 block">
            <span className="font-black">{label}</span>
            <span className="muted text-sm block mt-1">{placeholder}</span>
            {key === 'heroDescription' || key === 'seoDescription' || key === 'announcement' ? (
              <textarea className="input mt-3 min-h-28" maxLength={max} value={form[key] || ''} onChange={(e) => update(key, e.target.value)} />
            ) : (
              <input className="input mt-3" maxLength={max} value={form[key] || ''} onChange={(e) => update(key, e.target.value)} />
            )}
          </label>
        ))}
      </div>

      <div className="card p-6 mt-5">
        <h2 className="text-xl font-black">ملاحظات النشر</h2>
        <p className="muted mt-2 leading-8">تغييرات المحتوى محفوظة في PostgreSQL، وليست داخل state مؤقت. أي تعديل هنا يصبح قابلًا للاستخدام من الموقع المنشور بعد الحفظ.</p>
        <p className="muted mt-1 leading-8">بيانات الدفع وYouTube والمفاتيح السرية لا توضع هنا؛ تظل في متغيرات البيئة وتكاملات الباك إند.</p>
      </div>
    </AdminShell>
  )
}
