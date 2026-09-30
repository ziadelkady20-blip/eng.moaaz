'use client'

import Link from 'next/link'
import { ArrowLeft, BookOpen, CheckCircle2, ClipboardCheck, Code2, GraduationCap, Sparkles, Target, Users } from 'lucide-react'

const grades=[
  {title:'الصف الأول الثانوي',subtitle:'شرح البرمجة من الأساسيات لحد التطبيق العملي.',label:'أولى ثانوي'},
  {title:'الصف الثاني الثانوي',subtitle:'مراجعات، تطبيقات، واجبات واختبارات في البرمجة.',label:'تانية ثانوي'},
]

const features=[
  {icon:Code2,title:'شرح البرمجة ببساطة',text:'محتوى مرتب من الأساسيات لحد حل المسائل والتطبيق العملي.'},
  {icon:ClipboardCheck,title:'اختبارات وواجبات',text:'اختبارات إلكترونية وواجبات تظهر للطالب حسب مرحلته الدراسية.'},
  {icon:Target,title:'متابعة مستواك',text:'تابع درجاتك وتقدمك واعرف نقاط القوة والموضوعات التي تحتاج مراجعة.'},
  {icon:Users,title:'منصة كاملة مع الباشمهندس معاذ',text:'الكورسات والدروس والامتحانات والواجبات كلها في مكان واحد.'},
]

export default function Home(){
 return <main className="landing-page" style={{background:'#f8f7f2',color:'#17243a'}}>
  <section className="relative overflow-hidden" style={{background:'radial-gradient(circle at 15% 35%,#fff0d8 0,transparent 32%),linear-gradient(180deg,#fffdf8 0%,#f8f7f2 100%)'}}>
   <div className="absolute -left-24 top-20 h-80 w-80 rounded-full bg-[#ffe8c2] blur-3xl opacity-70"/>
   <div className="mx-auto grid min-h-[680px] w-[min(1380px,calc(100%-40px))] items-center gap-8 lg:grid-cols-[1fr_1.05fr]">
    <div className="relative z-10 py-16 text-right">
      <span className="inline-flex items-center gap-2 rounded-full border border-[#f2d7ad] bg-[#fff7e9] px-4 py-2 text-sm font-black text-[#d46d00]"><Sparkles size={15}/> منصة الباشمهندس معاذ</span>
      <h1 className="mt-5 text-5xl font-black leading-[1.1] tracking-tight text-[#17243a] md:text-7xl">اتعلم البرمجة<br/><span className="text-[#ed7b0b]">بطريقة أسهل</span></h1>
      <p className="mt-5 max-w-2xl text-lg font-semibold leading-8 text-[#687080]">منصة تعليمية متخصصة في شرح مادة البرمجة لطلاب الصف الأول والثاني الثانوي، مع كورسات ودروس وواجبات واختبارات في مكان واحد.</p>
      <div className="mt-8 flex flex-wrap justify-start gap-3">
       <Link href="/register" className="inline-flex h-13 items-center justify-center gap-2 rounded-2xl bg-[#ed7b0b] px-7 font-black text-white shadow-[0_14px_30px_rgba(237,123,11,.2)]">ابدأ التعلم <ArrowLeft size={18}/></Link>
       <Link href="/student/courses" className="inline-flex h-13 items-center justify-center gap-2 rounded-2xl border border-[#e1ded6] bg-white px-7 font-black text-[#26334a]">تصفح الكورسات <BookOpen size={18}/></Link>
      </div>
      <div className="mt-8 flex flex-wrap gap-8 text-right">
       <div><strong className="block text-xl font-black text-[#17243a]">2</strong><span className="text-xs font-bold text-[#7a808c]">مراحل دراسية</span></div>
       <div><strong className="block text-xl font-black text-[#17243a]">100%</strong><span className="text-xs font-bold text-[#7a808c]">تعليم أونلاين</span></div>
       <div><strong className="block text-xl font-black text-[#17243a]">∞</strong><span className="text-xs font-bold text-[#7a808c]">مراجعة وتدريب</span></div>
      </div>
    </div>
    <div className="relative flex min-h-[590px] items-center justify-center lg:justify-start">
      <div className="absolute h-[500px] w-[500px] rounded-full bg-[#fff0d8]"/>
      <img src="/api/hero-programming" alt="الباشمهندس معاذ - شرح البرمجة" className="relative z-10 h-[590px] w-[590px] max-w-full object-contain drop-shadow-[0_28px_45px_rgba(23,36,58,.15)]"/>
      <div className="absolute right-2 top-24 z-20 rounded-2xl border border-white bg-white/95 p-4 shadow-xl"><GraduationCap className="text-[#ed7b0b]" size={30}/><b className="mt-1 block text-xs text-[#17243a]">شرح منظم</b></div>
      <div className="absolute bottom-20 left-0 z-20 rounded-2xl border border-white bg-white/95 p-4 shadow-xl"><CheckCircle2 className="text-[#0aa37a]" size={30}/><b className="mt-1 block text-xs text-[#17243a]">تدريب واختبارات</b></div>
    </div>
   </div>
  </section>

  <section id="stages" className="bg-[#f8f7f2] px-5 py-20">
   <div className="mx-auto w-[min(1240px,100%)]">
    <div className="mb-10 text-center"><span className="rounded-full bg-[#fff0d8] px-4 py-2 text-xs font-black text-[#d46d00]">المراحل الدراسية</span><h2 className="mt-5 text-4xl font-black text-[#17243a]">اختار مرحلتك وابدأ</h2><p className="mt-2 font-semibold text-[#7a808c]">المحتوى متاح حسب الصف الدراسي</p></div>
    <div className="grid gap-6 md:grid-cols-2">
      {grades.map(g=><Link href="/student/courses" key={g.title} className="group relative overflow-hidden rounded-[28px] border border-[#e8e4dc] bg-white p-7 shadow-[0_15px_35px_rgba(23,36,58,.07)] transition hover:-translate-y-2 hover:shadow-[0_24px_45px_rgba(23,36,58,.12)]">
        <div className="absolute -left-16 -top-16 h-40 w-40 rounded-full bg-[#fff0d8]"/><div className="relative flex items-start justify-between"><div><span className="rounded-full bg-[#fff7e9] px-3 py-1 text-xs font-black text-[#d46d00]">{g.label}</span><h3 className="mt-5 text-2xl font-black text-[#17243a]">{g.title}</h3><p className="mt-2 max-w-md text-sm font-semibold leading-7 text-[#777e8a]">{g.subtitle}</p></div><div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#fff0d8] text-[#ed7b0b]"><BookOpen size={28}/></div></div><div className="mt-7 inline-flex items-center gap-2 font-black text-[#ed7b0b]">ابدأ الآن <ArrowLeft size={17}/></div>
      </Link>)}
    </div>
   </div>
  </section>

  <section id="features" className="bg-white px-5 py-20"><div className="mx-auto w-[min(1240px,100%)]"><div className="mb-10 text-center"><span className="rounded-full bg-[#e9f8f3] px-4 py-2 text-xs font-black text-[#078461]">مميزات المنصة</span><h2 className="mt-5 text-4xl font-black text-[#17243a]">كل أدوات المذاكرة في مكان واحد</h2></div><div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">{features.map(f=><div key={f.title} className="rounded-[24px] border border-[#ebe8e1] bg-[#fffdf8] p-6 shadow-[0_12px_28px_rgba(23,36,58,.05)]"><div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#fff0d8] text-[#ed7b0b]"><f.icon size={24}/></div><h3 className="mt-5 text-lg font-black text-[#17243a]">{f.title}</h3><p className="mt-2 text-sm font-semibold leading-7 text-[#777e8a]">{f.text}</p></div>)}</div></div></section>

  <section id="about" className="bg-[#f8f7f2] px-5 py-16"><div className="mx-auto max-w-4xl rounded-[30px] border border-[#e8e4dc] bg-white p-8 text-center shadow-[0_18px_45px_rgba(23,36,58,.07)]"><div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#17243a] text-white"><Code2/></div><h2 className="mt-5 text-3xl font-black text-[#17243a]">مع الباشمهندس معاذ — البرمجة هتبقى أوضح</h2><p className="mx-auto mt-3 max-w-2xl font-semibold leading-8 text-[#777e8a]">اتعلم، طبّق، حل واجبات، اختبر نفسك، وتابع تقدمك خطوة بخطوة.</p></div></section>

  <footer className="border-t border-[#e8e4dc] bg-[#fffdf8] px-5 py-12"><div className="mx-auto flex w-[min(1240px,100%)] flex-col items-center justify-between gap-5 md:flex-row"><div className="flex items-center gap-3"><img src="/logo.png" alt="معاذ" className="h-14 w-14 rounded-2xl object-contain"/><div><b className="block text-lg font-black text-[#17243a]">الباشمهندس معاذ</b><span className="text-xs font-bold text-[#8b9099]">منصة شرح مادة البرمجة</span></div></div><div className="flex gap-5 text-sm font-black text-[#514f55]"><Link href="/register">إنشاء حساب</Link><Link href="/login">تسجيل الدخول</Link><Link href="/student/exams">الامتحانات</Link></div></div></footer>
 </main>
}
