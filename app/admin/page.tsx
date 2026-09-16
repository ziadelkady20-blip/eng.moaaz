'use client'

import AdminShell from '@/components/AdminShell'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft,
  BarChart3,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  CircleDollarSign,
  Clock3,
  GraduationCap,
  PlayCircle,
  Plus,
  Settings2,
  ShieldCheck,
  Users,
  WalletCards,
} from 'lucide-react'

type Stats = {
  students: number
  courses: number
  pending: number
  lessons: number
}

const initialStats: Stats = { students: 0, courses: 0, pending: 0, lessons: 0 }

function number(value: number) {
  return new Intl.NumberFormat('ar-EG').format(value)
}

export default function Admin() {
  const [stats, setStats] = useState<Stats>(initialStats)
  const [loading, setLoading] = useState(true)
  const [online, setOnline] = useState(false)

  useEffect(() => {
    let mounted = true
    fetch('/api/admin/stats')
      .then(async (response) => {
        if (!response.ok) throw new Error('stats')
        return response.json()
      })
      .then((data: Partial<Stats>) => {
        if (!mounted) return
        setStats({
          students: Number(data.students ?? 0),
          courses: Number(data.courses ?? 0),
          pending: Number(data.pending ?? 0),
          lessons: Number(data.lessons ?? 0),
        })
        setOnline(true)
      })
      .catch(() => mounted && setOnline(false))
      .finally(() => mounted && setLoading(false))

    return () => {
      mounted = false
    }
  }, [])

  const maxMetric = useMemo(
    () => Math.max(stats.students, stats.courses, stats.lessons, 1),
    [stats]
  )

  const cards = [
    {
      label: 'إجمالي الطلاب',
      value: stats.students,
      note: 'الحسابات المسجلة كطلاب',
      icon: Users,
      tone: 'purple',
      href: '/admin/users',
    },
    {
      label: 'الكورسات',
      value: stats.courses,
      note: 'كل الكورسات الحالية',
      icon: BookOpen,
      tone: 'blue',
      href: '/admin/courses',
    },
    {
      label: 'طلبات معلقة',
      value: stats.pending,
      note: 'تحتاج مراجعة من الإدارة',
      icon: Clock3,
      tone: 'amber',
      href: '/admin/payments',
    },
    {
      label: 'دروس بفيديو',
      value: stats.lessons,
      note: 'دروس مرتبطة بفيديوهات',
      icon: PlayCircle,
      tone: 'violet',
      href: '/admin/courses',
    },
  ] as const

  return (
    <AdminShell>
      <style>{`
        .admin-dashboard{direction:rtl;color:#241d31}
        .admin-hero{position:relative;overflow:hidden;border-radius:28px;padding:28px 30px;margin-bottom:22px;background:linear-gradient(135deg,#6d2fa3 0%,#7d3db2 48%,#4c1f76 100%);color:#fff;box-shadow:0 18px 42px rgba(77,31,120,.20)}
        .admin-hero:before,.admin-hero:after{content:'';position:absolute;border-radius:50%;background:rgba(255,255,255,.08);pointer-events:none}
        .admin-hero:before{width:260px;height:260px;left:-80px;top:-110px}.admin-hero:after{width:180px;height:180px;right:-40px;bottom:-95px}
        .admin-hero-inner{position:relative;z-index:1;display:flex;align-items:center;justify-content:space-between;gap:20px}
        .admin-kicker{display:inline-flex;align-items:center;gap:7px;padding:7px 11px;border-radius:999px;background:rgba(255,255,255,.13);border:1px solid rgba(255,255,255,.16);font-size:12px;font-weight:900;margin-bottom:12px}
        .admin-hero h1{margin:0;font-size:30px;line-height:1.25;font-weight:950;letter-spacing:-.5px}.admin-hero p{margin:9px 0 0;color:rgba(255,255,255,.82);font-size:14px;line-height:1.8;max-width:680px}
        .admin-status{display:flex;align-items:center;gap:9px;white-space:nowrap;padding:11px 14px;border-radius:15px;background:rgba(255,255,255,.11);border:1px solid rgba(255,255,255,.16);font-size:12px;font-weight:900}.status-dot{width:9px;height:9px;border-radius:50%;background:#9cf6b4;box-shadow:0 0 0 5px rgba(156,246,180,.12)}
        .stat-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px;margin-bottom:22px}
        .stat-card{position:relative;background:#fff;border:1px solid #ece7f3;border-radius:22px;padding:20px;box-shadow:0 10px 26px rgba(42,24,61,.06);transition:transform .2s ease,box-shadow .2s ease}.stat-card:hover{transform:translateY(-3px);box-shadow:0 16px 32px rgba(42,24,61,.10)}
        .stat-top{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}.stat-label{font-size:13px;color:#756d80;font-weight:850}.stat-value{font-size:31px;font-weight:950;line-height:1.15;margin-top:7px;color:#272037}.stat-note{font-size:11px;color:#9890a1;margin-top:7px;line-height:1.6}.stat-icon{width:46px;height:46px;border-radius:15px;display:grid;place-items:center}.stat-purple .stat-icon{background:#f2e8fb;color:#6d2fa3}.stat-blue .stat-icon{background:#eaf2ff;color:#3976d8}.stat-amber .stat-icon{background:#fff5df;color:#c7851d}.stat-violet .stat-icon{background:#f0e8ff;color:#7b4ad2}
        .stat-link{display:flex;align-items:center;gap:3px;margin-top:13px;color:#6d2fa3;font-size:11px;font-weight:950;text-decoration:none}.stat-link svg{transition:transform .2s}.stat-link:hover svg{transform:translateX(-3px)}
        .dashboard-grid{display:grid;grid-template-columns:1.35fr .85fr;gap:18px}.panel{background:#fff;border:1px solid #ece7f3;border-radius:22px;box-shadow:0 10px 26px rgba(42,24,61,.06);padding:20px}.panel-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:18px}.panel-title{display:flex;align-items:center;gap:9px;font-size:17px;font-weight:950;color:#2a2336}.panel-title-icon{width:36px;height:36px;border-radius:12px;background:#f2e8fb;color:#6d2fa3;display:grid;place-items:center}.panel-link{font-size:11px;font-weight:900;color:#6d2fa3;text-decoration:none}
        .overview-list{display:grid;gap:14px}.overview-row{display:grid;grid-template-columns:34px 1fr auto;align-items:center;gap:11px}.overview-row-icon{width:34px;height:34px;border-radius:11px;display:grid;place-items:center;background:#f8f5fb;color:#6d2fa3}.overview-name{font-size:12px;font-weight:900;color:#4b4355}.overview-bar{height:8px;border-radius:999px;background:#f0edf4;overflow:hidden;margin-top:6px}.overview-fill{height:100%;border-radius:inherit;background:linear-gradient(90deg,#6d2fa3,#b27be0)}.overview-value{font-size:12px;font-weight:950;color:#30273b}
        .quick-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:11px}.quick-card{display:flex;align-items:center;gap:11px;text-decoration:none;background:#fbf9fd;border:1px solid #eee9f4;border-radius:16px;padding:13px;color:#31293b;transition:.2s}.quick-card:hover{transform:translateY(-2px);border-color:#dccced;background:#fff}.quick-icon{width:38px;height:38px;border-radius:12px;background:#f0e7fb;color:#6d2fa3;display:grid;place-items:center;flex:0 0 38px}.quick-card strong{display:block;font-size:12px;font-weight:950}.quick-card span{display:block;font-size:10px;color:#8a8391;margin-top:3px;line-height:1.5}.quick-card .arrow{margin-right:auto;color:#9d91a8}
        .health{margin-top:18px;padding:14px;border-radius:16px;background:#faf8fc;border:1px solid #eee9f4}.health-line{display:flex;align-items:center;justify-content:space-between;font-size:11px;font-weight:900;color:#4b4355}.health-chip{display:inline-flex;align-items:center;gap:6px;color:#248250}.health-chip i{width:7px;height:7px;border-radius:50%;background:#3ac577}.health p{font-size:10px;color:#8c8592;line-height:1.7;margin:8px 0 0}
        .loading-bar{height:10px;border-radius:999px;background:linear-gradient(90deg,#eee8f4 25%,#f7f4fa 37%,#eee8f4 50%);background-size:300% 100%;animation:shimmer 1.3s infinite}
        @keyframes shimmer{0%{background-position:100% 0}100%{background-position:-100% 0}}
        @media(max-width:1000px){.stat-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.dashboard-grid{grid-template-columns:1fr}.admin-hero-inner{align-items:flex-start;flex-direction:column}}
        @media(max-width:640px){.admin-hero{padding:22px}.admin-hero h1{font-size:24px}.stat-grid{grid-template-columns:1fr 1fr}.stat-card{padding:15px}.stat-value{font-size:26px}.quick-grid{grid-template-columns:1fr}.panel{padding:16px}}
      `}</style>

      <div className="admin-dashboard">
        <section className="admin-hero">
          <div className="admin-hero-inner">
            <div>
              <div className="admin-kicker"><GraduationCap size={15}/> مركز إدارة المنصة</div>
              <h1>مرحبًا بك في لوحة التحكم 👋</h1>
              <p>من هنا تقدر تتابع أهم أرقام المنصة، تدير المحتوى والكورسات، تراجع الطلبات والمدفوعات، وتوصل بسرعة لكل أدوات الإدارة.</p>
            </div>
            <div className="admin-status">
              <span className="status-dot" style={{ background: online ? '#9cf6b4' : '#ffd37a' }} />
              {loading ? 'جاري الاتصال بقاعدة البيانات' : online ? 'النظام متصل ويعمل' : 'تعذر تحديث الإحصائيات'}
            </div>
          </div>
        </section>

        <section className="stat-grid">
          {cards.map(({ label, value, note, icon: Icon, tone, href }) => (
            <Link href={href} key={label} className={`stat-card stat-${tone}`} style={{ textDecoration: 'none' }}>
              <div className="stat-top">
                <div>
                  <div className="stat-label">{label}</div>
                  {loading ? <div className="loading-bar" style={{ width: 86, marginTop: 12 }} /> : <div className="stat-value">{number(value)}</div>}
                  <div className="stat-note">{note}</div>
                </div>
                <div className="stat-icon"><Icon size={21}/></div>
              </div>
              <span className="stat-link">فتح الإدارة <ArrowLeft size={13}/></span>
            </Link>
          ))}
        </section>

        <section className="dashboard-grid">
          <div className="panel">
            <div className="panel-head">
              <div className="panel-title"><span className="panel-title-icon"><BarChart3 size={18}/></span>نظرة سريعة على المنصة</div>
              <Link href="/admin" className="panel-link">تحديث البيانات</Link>
            </div>
            <div className="overview-list">
              <div className="overview-row">
                <div className="overview-row-icon"><Users size={16}/></div>
                <div><div className="overview-name">الطلاب المسجلون</div><div className="overview-bar"><div className="overview-fill" style={{ width: `${Math.max(6, Math.round((stats.students / maxMetric) * 100))}%` }}/></div></div>
                <div className="overview-value">{loading ? '—' : number(stats.students)}</div>
              </div>
              <div className="overview-row">
                <div className="overview-row-icon"><BookOpen size={16}/></div>
                <div><div className="overview-name">الكورسات</div><div className="overview-bar"><div className="overview-fill" style={{ width: `${Math.max(6, Math.round((stats.courses / maxMetric) * 100))}%` }}/></div></div>
                <div className="overview-value">{loading ? '—' : number(stats.courses)}</div>
              </div>
              <div className="overview-row">
                <div className="overview-row-icon"><PlayCircle size={16}/></div>
                <div><div className="overview-name">الدروس المرتبطة بفيديو</div><div className="overview-bar"><div className="overview-fill" style={{ width: `${Math.max(6, Math.round((stats.lessons / maxMetric) * 100))}%` }}/></div></div>
                <div className="overview-value">{loading ? '—' : number(stats.lessons)}</div>
              </div>
              <div className="overview-row">
                <div className="overview-row-icon"><WalletCards size={16}/></div>
                <div><div className="overview-name">طلبات تحتاج مراجعة</div><div className="overview-bar"><div className="overview-fill" style={{ width: `${Math.max(6, Math.round((stats.pending / Math.max(stats.pending, maxMetric)) * 100))}%` }}/></div></div>
                <div className="overview-value">{loading ? '—' : number(stats.pending)}</div>
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-head">
              <div className="panel-title"><span className="panel-title-icon"><Settings2 size={18}/></span>إجراءات سريعة</div>
            </div>
            <div className="quick-grid">
              <Link href="/admin/courses" className="quick-card"><span className="quick-icon"><Plus size={18}/></span><span><strong>إضافة محتوى</strong><span>إدارة الكورسات والدروس</span></span><ChevronLeft className="arrow" size={15}/></Link>
              <Link href="/admin/payments" className="quick-card"><span className="quick-icon"><CircleDollarSign size={18}/></span><span><strong>مراجعة المدفوعات</strong><span>الطلبات والحجوزات المعلقة</span></span><ChevronLeft className="arrow" size={15}/></Link>
              <Link href="/admin/users" className="quick-card"><span className="quick-icon"><Users size={18}/></span><span><strong>المستخدمون</strong><span>الطلاب والحسابات</span></span><ChevronLeft className="arrow" size={15}/></Link>
              <Link href="/admin/settings" className="quick-card"><span className="quick-icon"><Settings2 size={18}/></span><span><strong>إعدادات المنصة</strong><span>الإعدادات العامة</span></span><ChevronLeft className="arrow" size={15}/></Link>
            </div>
            <div className="health">
              <div className="health-line"><span>حالة الإدارة</span><span className="health-chip"><i/> صلاحيات الإدارة مفعلة</span></div>
              <p><ShieldCheck size={13} style={{ verticalAlign: 'middle', marginLeft: 4 }} /> الوصول للوحة التحكم مقصور على حسابات <b>ADMIN</b> ويتم التحقق من الجلسة قبل عرض البيانات.</p>
            </div>
          </div>
        </section>
      </div>
    </AdminShell>
  )
}
