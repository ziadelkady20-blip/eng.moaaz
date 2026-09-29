'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ArrowLeft, BookOpen, CheckCircle2, ClipboardCheck, GraduationCap, PlayCircle, Sparkles, Target, Users } from 'lucide-react'
import HomeAuthHeader from '@/components/HomeAuthHeader'
import WhatsAppContact from '@/components/WhatsAppContact'

const grades=[
  {title:'الصف الأول الثانوي',subtitle:'محتوى منظم ومتابعة مستمرة للصف الأول',tone:'purple'},
  {title:'الصف الثاني الثانوي',subtitle:'شرح ومراجعات واختبارات للصف الثاني',tone:'violet'},
]

const features=[
  {icon:BookOpen,title:'شرح منظم',text:'الدروس والكورسات مرتبة بشكل واضح لتعرف تبدأ منين وتكمل فين.'},
  {icon:ClipboardCheck,title:'اختبارات وواجبات',text:'اختبارات إلكترونية وواجبات تضاف من المدرس وتظهر للطالب تلقائيًا.'},
  {icon:Target,title:'نتيجة فورية',text:'بعد تسليم الاختبار تظهر النتيجة والنسبة مباشرة للطالب.'},
  {icon:Users,title:'متابعة مستمرة',text:'متابعة الطلاب والدرجات والتقدم من لوحة المدرس.'},
]

export default function Home(){
 const [settings,setSettings]=useState<any>({})
 useEffect(()=>{fetch('/api/site-settings',{cache:'no-store'}).then(r=>r.json()).then(d=>setSettings(d||{})).catch(()=>{})},[])
 const teacherName=settings.teacherName||'أ/ معاذ'
 return <main className="landing-page">
  <HomeAuthHeader/>
  <section className="relative overflow-hidden bg-[radial-gradient(circle_at_15%_35%,#f0e5ff_0,transparent_33%),linear-gradient(180deg,#fff,#fbf8ff)]">
   <div className="absolute -left-32 top-20 h-80 w-80 rounded-full bg-[#f0e5ff] blur-3xl opacity-70"/>
   <div className="mx-auto grid min-h-[650px] w-[min(1380px,calc(100%-40px))] items-center gap-8 lg:grid-cols-[1fr_.95fr]">
    <div className="relative z-10 py-16 text-right">
      <span className="inline-flex items-center gap-2 rounded-full border border-[#e3d3f4] bg-[#f5edfc] px-4 py-2 text-sm font-black text-[#6d2fa3]"><Sparkles size={15}/> منصتك التعليمية مع {teacherName}</span>
      <h1 className="mt-5 text-5xl font-black leading-[1.12] tracking-tight text-[#241c35] md:text-7xl">ابدأ رحلتك التعليمية<br/><span className="bg-gradient-to-l from-[#6d2fa3] to-[#a15ee5] bg-clip-text text-transparent">مع أ/ معاذ</span></h1>
      <p className="mt-5 max-w-2xl text-lg font-semibold leading-8 text-[#6e6877]">شرح، كورسات، واجبات واختبارات إلكترونية في منصة واحدة، مخصصة لطلاب الصف الأول والثاني الثانوي.</p>
      <div className="mt-8 flex flex-wrap justify-start gap-3">
       <Link href="/register" className="inline-flex h-13 items-center justify-center gap-2 rounded-2xl bg-[#6d2fa3] px-7 font-black text-white shadow-[0_14px_30px_rgba(109,47,163,.2)]">إنشاء حساب <ArrowLeft size={18}/></Link>
       <Link href="/student/courses" className="inline-flex h-13 items-center justify-center gap-2 rounded-2xl border border-[#e4ddea] bg-white px-7 font-black text-[#352c42]">تصفح الكورسات <BookOpen size={18}/></Link>
      </div>
      <div className="mt-8 flex flex-wrap gap-8 text-right">
       <div><strong className="block text-xl font-black text-[#321c78]">2</strong><span className="text-xs font-bold text-[#77717f]">مراحل دراسية</span></div>
       <div><strong className="block text-xl font-black text-[#321c78]">24/7</strong><span className="text-xs font-bold text-[#77717f]">الوصول للمحتوى</span></div>
       <div><strong className="block text-xl font-black text-[#321c78]">100%</strong><span className="text-xs font-bold text-[#77717f]">تعليم أونلاين</span></div>
      </div>
    </div>
    <div className="relative flex min-h-[540px] items-center justify-center">
      <div className="absolute h-[460px] w-[460px] rounded-full bg-[#f1e7fb] blur-[1px]"/>
      <img src="/hero.jpeg" alt="أ/ معاذ" className="relative z-10 h-[480px] w-[480px] rounded-[38px] object-cover shadow-[0_28px_60px_rgba(61,37,91,.18)]"/>
      <div className="absolute right-0 top-20 z-20 rounded-2xl border border-white bg-white/95 p-4 shadow-xl"><GraduationCap className="text-[#6d2fa3]" size={30}/><b className="mt-1 block text-xs">شرح احترافي</b></div>
      <div className="absolute bottom-16 left-0 z-20 rounded-2xl border border-white bg-white/95 p-4 shadow-xl"><ClipboardCheck className="text-[#6d2fa3]" size={30}/><b className="mt-1 block text-xs">اختبارات إلكترونية</b></div>
    </div>
   </div>
  </section>

  <section className="bg-white px-5 py-20">
   <div className="mx-auto w-[min(1240px,100%)]">
    <div className="mb-10 text-center"><span className="rounded-full bg-[#f0e7fb] px-4 py-2 text-xs font-black text-[#6d2fa3]">المراحل الدراسية</span><h2 className="mt-5 text-4xl font-black text-[#292238]">اختار مرحلتك وابدأ</h2><p className="mt-2 font-semibold text-[#7a7484]">المحتوى عندك حسب الصف الدراسي فقط</p></div>
    <div className="grid gap-6 md:grid-cols-2">
      {grades.map((g,i)=><Link href="/student/courses" key={g.title} className="group relative overflow-hidden rounded-[28px] border border-[#ece7f2] bg-white p-7 shadow-[0_15px_35px_rgba(43,25,63,.08)] transition hover:-translate-y-2 hover:shadow-[0_24px_45px_rgba(109,47,163,.14)]">
        <div className="absolute -left-16 -top-16 h-40 w-40 rounded-full bg-[#f0e7fb]"/><div className="relative flex items-start justify-between"><div><span className="rounded-full bg-[#f5edfc] px-3 py-1 text-xs font-black text-[#6d2fa3]">{i===0?'الأولى':'الثانية'}</span><h3 className="mt-5 text-2xl font-black text-[#292238]">{g.title}</h3><p className="mt-2 max-w-md text-sm font-semibold leading-7 text-[#777080]">{g.subtitle}</p></div><div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#f0e7fb] text-[#6d2fa3]"><BookOpen size={28}/></div></div><div className="mt-7 inline-flex items-center gap-2 font-black text-[#6d2fa3]">ابدأ الآن <ArrowLeft size={17}/></div>
      </Link>)}
    </div>
   </div>
  </section>

  <section className="bg-gradient-to-b from-white to-[#fbf8ff] px-5 py-20"><div className="mx-auto w-[min(1240px,100%)]"><div className="mb-10 text-center"><span className="rounded-full bg-[#f0e7fb] px-4 py-2 text-xs font-black text-[#6d2fa3]">مميزات المنصة</span><h2 className="mt-5 text-4xl font-black text-[#292238]">كل اللي تحتاجه في مكان واحد</h2></div><div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">{features.map(f=><div key={f.title} className="rounded-[24px] border border-[#eee8f5] bg-white p-6 shadow-[0_12px_28px_rgba(45,25,65,.05)]"><div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#f0e7fb] text-[#6d2fa3]"><f.icon size={24}/></div><h3 className="mt-5 text-lg font-black">{f.title}</h3><p className="mt-2 text-sm font-semibold leading-7 text-[#777080]">{f.text}</p></div>)}</div></div></section>

  <footer className="border-t border-[#eee8f5] bg-[#fffdf5] px-5 py-12"><div className="mx-auto flex w-[min(1240px,100%)] flex-col items-center justify-between gap-5 md:flex-row"><div className="flex items-center gap-3"><img src="/logo.png" alt="معاذ" className="h-14 w-14 rounded-2xl object-contain"/><div><b className="block text-lg font-black">أ/ معاذ</b><span className="text-xs font-bold text-[#8d8495]">منصة تعليمية للمرحلة الثانوية</span></div></div><div className="flex gap-5 text-sm font-black text-[#51495e]"><Link href="/register">إنشاء حساب</Link><Link href="/login">تسجيل الدخول</Link><Link href="/student/exams">الامتحانات</Link></div></div></footer>
  <WhatsAppContact/>
 </main>
}
