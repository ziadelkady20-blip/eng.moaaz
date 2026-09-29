'use client'

import DashboardShell from '@/components/DashboardShell'
import Stat from '@/components/ui/Stat'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Teacher(){
 const [d,setD]=useState<any>()
 useEffect(()=>{fetch('/api/teacher/dashboard',{cache:'no-store'}).then(r=>r.json()).then(setD)},[])
 if(!d)return <DashboardShell title="لوحة المدرس"><div className="card p-10">جاري تحميل لوحة المدرس...</div></DashboardShell>
 return <DashboardShell title="لوحة المدرس"><div className="pb-10"><h1 className="text-3xl font-black">مرحبًا يا {d.teacher?.split(' ')[0]||'أستاذنا'} 👋</h1><p className="muted mt-2 mb-7">إدارة المحتوى والطلاب والواجبات والاختبارات من مكان واحد.</p><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><Stat label="الكورسات" value={d.stats.courses}/><Stat label="الطلاب" value={d.stats.students}/><Stat label="الدروس" value={d.stats.lessons}/><Stat label="واجبات تحتاج مراجعة" value={d.stats.pendingAssignments}/></div><div className="mt-8 flex flex-wrap gap-3"><Link className="btn btn-primary" href="/teacher/courses">إدارة الكورسات</Link><Link className="btn btn-secondary" href="/teacher/exams">الامتحانات</Link><Link className="btn btn-secondary" href="/teacher/assignments">الواجبات</Link><Link className="btn btn-secondary" href="/teacher/students">الطلاب</Link><Link className="btn btn-secondary" href="/teacher/attendance">الحضور</Link></div><h2 className="mt-9 mb-4 text-2xl font-black">كورساتك</h2><div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{d.courses.map((c:any)=><Link key={c.id} href={`/teacher/courses/${c.id}`} className="card p-6 transition hover:-translate-y-1"><div className="flex justify-between"><span className={`badge ${c.published?'badge-success':'badge-muted'}`}>{c.published?'منشور':'مسودة'}</span><span className="text-2xl">📚</span></div><h3 className="mt-5 text-xl font-black">{c.title}</h3><p className="muted mt-2">{c.students} طالب • {c.lessons} درس</p></Link>)}</div></div></DashboardShell>
}
