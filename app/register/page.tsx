'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const grades = [
  ['الصف الأول الثانوي', 'الصف الأول الثانوي'],
  ['الصف الثاني الثانوي', 'الصف الثاني الثانوي'],
] as const

const styles = `
.register-page{min-height:100vh;background:#fbf8ff;color:#28213d;direction:rtl;font-family:Arial,"Noto Sans Arabic",sans-serif;position:relative;overflow-x:hidden;padding-bottom:60px}
.register-page:before{content:"";position:absolute;pointer-events:none;width:560px;height:560px;top:-300px;right:-180px;border-radius:50%;background:radial-gradient(circle,rgba(124,58,237,.13),rgba(124,58,237,0) 68%)}
.register-page:after{content:"";position:absolute;pointer-events:none;width:430px;height:430px;bottom:-220px;left:-150px;border-radius:50%;background:radial-gradient(circle,rgba(168,85,247,.10),rgba(168,85,247,0) 70%)}
.register-nav{position:relative;z-index:10;width:min(1240px,calc(100% - 28px));height:68px;margin:18px auto 32px;background:rgba(255,255,255,.94);border:1px solid #eee6fa;border-radius:34px;box-shadow:0 12px 35px rgba(72,42,116,.10);display:flex;align-items:center;gap:24px;padding:0 18px;backdrop-filter:blur(16px)}
.register-brand{display:flex;align-items:center;gap:10px;min-width:190px}.register-brand img{width:44px;height:44px;object-fit:contain;border-radius:12px}.register-brand strong{font-size:16px;font-weight:950;color:#24183d;white-space:nowrap}
.register-links{display:flex;align-items:center;justify-content:center;gap:34px;flex:1}.register-links a{color:#312a40;text-decoration:none;font-size:14px;font-weight:850}.register-links a:hover{color:#6d2fa3}
.register-nav-actions{display:flex;align-items:center;gap:9px}.nav-pill{height:40px;border-radius:22px;padding:0 15px;border:1px solid #e7def3;background:#fff;color:#342b46;font:inherit;font-weight:900;cursor:pointer;text-decoration:none;display:grid;place-items:center}.nav-cta{height:42px;border:0;border-radius:22px;padding:0 19px;background:linear-gradient(135deg,#8b5cf6,#6d28d9);color:#fff;font-weight:950;box-shadow:0 8px 18px rgba(124,58,237,.22);cursor:pointer}
.register-main{position:relative;z-index:2;width:min(820px,calc(100% - 24px));margin:0 auto}.register-heading{text-align:center;margin:0 0 25px}.register-heading h1{font-size:40px;line-height:1.15;margin:0;color:#251a3c;font-weight:950;letter-spacing:-1px}.register-heading p{margin:8px 0 0;color:#9289a4;font-size:15px;font-weight:700}
.register-stepper{display:grid;grid-template-columns:1fr 90px 1fr 90px 1fr;align-items:center;margin:0 auto 24px;max-width:700px}.step-item{display:flex;align-items:center;justify-content:center;gap:9px;color:#aaa2b8;font-size:13px;font-weight:900;white-space:nowrap}.step-dot{width:36px;height:36px;border-radius:50%;display:grid;place-items:center;background:#eee9f5;color:#a29aac;font-size:12px;font-weight:950}.step-item.active{color:#7135bd}.step-item.active .step-dot{background:linear-gradient(135deg,#8b5cf6,#6d28d9);color:#fff;box-shadow:0 8px 20px rgba(124,58,237,.25)}.step-item.done{color:#7c3aed}.step-item.done .step-dot{background:#eee5ff;color:#7c3aed}.step-line{height:1px;background:#e5dff0;width:100%}
.register-card{border:1px solid #ebe3f5;border-radius:28px;padding:32px 36px 26px;background:rgba(255,255,255,.97);box-shadow:0 22px 65px rgba(61,37,91,.09)}.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px 18px}.field{display:flex;flex-direction:column;gap:9px}.field.full{grid-column:1/-1}.field label{font-size:14px;font-weight:900;color:#302740}.field label em{color:#ef4444;font-style:normal}.field small{color:#aaa1b2;font-size:11px;font-weight:700;margin-top:-3px}.field input,.field select{height:54px;width:100%;box-sizing:border-box;border:1px solid #e4ddec;border-radius:14px;background:#fcfbfe;padding:0 16px;color:#302740;font:inherit;font-size:14px;outline:none;transition:.2s}.field input::placeholder{color:#b0a8b9}.field input:focus,.field select:focus{border-color:#a78bfa;box-shadow:0 0 0 4px rgba(124,58,237,.09);background:#fff}
.choice-row{display:grid;grid-template-columns:1fr 1fr;gap:14px}.choice{height:54px;border:1px solid #e2d9ed;border-radius:14px;background:#fff;color:#655d72;font:inherit;font-weight:900;cursor:pointer;transition:.2s}.choice.selected{border-color:#8b5cf6;background:linear-gradient(135deg,#8b5cf6,#6d28d9);color:#fff;box-shadow:0 9px 20px rgba(124,58,237,.18)}
.photo-box{border:1.5px dashed #cfc0e5;border-radius:18px;padding:28px;text-align:center;background:#fbf9ff}.photo-placeholder{width:94px;height:94px;border-radius:50%;display:grid;place-items:center;margin:0 auto 12px;background:#f0eaff;color:#7c3aed;font-size:30px}.photo-note{margin:10px 0 0;color:#a49bad;font-size:11px;font-weight:700}
.error-box{grid-column:1/-1;border:1px solid #fecaca;background:#fff5f5;color:#b42318;border-radius:13px;padding:11px 14px;font-size:12px;font-weight:800}.register-actions{display:grid;grid-template-columns:140px 1fr;gap:12px;margin-top:26px;padding-top:20px;border-top:1px solid #eee8f4}.btn{height:54px;border-radius:14px;font:inherit;font-size:14px;font-weight:950;cursor:pointer}.btn-primary{border:0;background:linear-gradient(135deg,#8b5cf6,#6d28d9);color:#fff;box-shadow:0 12px 24px rgba(124,58,237,.18)}.btn-primary:disabled{opacity:.6;cursor:not-allowed}.btn-secondary{border:1px solid #dfd6e9;background:#fff;color:#51495e;text-decoration:none;display:grid;place-items:center}
.review{display:flex;flex-direction:column;border:1px solid #e9e1f1;border-radius:16px;overflow:hidden;background:#fff}.review-row{display:flex;align-items:center;justify-content:space-between;gap:20px;padding:14px 15px;border-bottom:1px solid #eee8f4;font-size:13px}.review-row:last-child{border-bottom:0}.review-row span{color:#91889c}.review-row strong{color:#2c2340}.register-footer{text-align:center;margin-top:18px;color:#a49bab;font-size:11px;font-weight:700}.mobile-nav{display:none}
@media(max-width:900px){.register-links{gap:18px}.register-nav{gap:10px}.register-brand{min-width:auto}.nav-cta{display:none}}
@media(max-width:700px){.register-nav{height:58px;margin-top:10px;width:calc(100% - 20px);padding:0 12px}.register-links,.nav-pill{display:none}.register-brand{flex:1}.mobile-nav{display:grid}.register-main{width:calc(100% - 20px)}.register-heading h1{font-size:31px}.register-card{padding:22px 17px}.form-grid{grid-template-columns:1fr}.field.full{grid-column:auto}.choice-row{grid-template-columns:1fr}.register-stepper{grid-template-columns:1fr 18px 1fr 18px 1fr}.step-line{width:100%}.step-item{font-size:11px;gap:5px}.step-dot{width:30px;height:30px}.register-actions{grid-template-columns:1fr}.btn-secondary{order:2}}
`

export default function Register(){
  const router=useRouter()
  const [step,setStep]=useState(1)
  const [form,setForm]=useState({name:'',birthDate:'',phone:'',password:'',grade:'',studyType:'ONLINE',attendanceType:'ONLINE',gender:'MALE',governorate:'الفيوم',school:'',guardianPhone:'',photo:''})
  const [error,setError]=useState('')
  const [loading,setLoading]=useState(false)
  const set=(k:keyof typeof form,v:string)=>setForm(x=>({...x,[k]:v}))

  function next(){
    setError('')
    if(step===1){
      if(!form.name||!form.birthDate||!/^[0-9٠-٩]{11}$/.test(form.phone)||form.password.length<8) return setError('اكتب البيانات الأساسية بشكل صحيح وكلمة المرور 8 أحرف على الأقل.')
      const birth=new Date(form.birthDate+'T00:00:00'); const today=new Date(); let age=today.getFullYear()-birth.getFullYear(); const m=today.getMonth()-birth.getMonth(); if(m<0||(m===0&&today.getDate()<birth.getDate())) age--
      if(age<16) return setError('يجب أن يكون عمر الطالب 16 سنة أو أكثر.')
    }
    if(step===2){
      if(!form.guardianPhone||!/^[0-9٠-٩]{11}$/.test(form.guardianPhone)) return setError('اكتب رقم ولي الأمر بشكل صحيح.')
      if(!form.governorate||!form.grade||!form.school) return setError('أكمل البيانات الدراسية المطلوبة.')
    }
    setStep(s=>Math.min(3,s+1))
  }

  async function submit(){
    setLoading(true);setError('')
    try{
      const r=await fetch('/api/auth/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:form.name,phone:form.phone,password:form.password,gradeId:form.grade,governorateId:form.governorate,schoolId:form.school,studyType:form.studyType,guardianPhone:form.guardianPhone})})
      const d=await r.json();if(!r.ok)throw new Error(d.error)
      router.push('/student');router.refresh()
    }catch(e){setError(e instanceof Error?e.message:'تعذر إنشاء الحساب')}finally{setLoading(false)}
  }

  const labels=['المعلومات الأساسية','البيانات الدراسية','الصورة']
  return <main className="register-page"><style>{styles}</style>
    <nav className="register-nav">
      <div className="register-brand"><img src="/logo.png" alt="برمجها معاذ"/><strong>برمجها معاذ</strong></div>
      <div className="register-links"><Link href="/">الرئيسية</Link><Link href="/student/courses">الكورسات</Link><Link href="/student/books">الكتب</Link><Link href="/">عن المنصة</Link></div>
      <div className="register-nav-actions"><button className="nav-pill" type="button">EN</button><button className="nav-cta" type="button" onClick={()=>router.push('/login')}>تسجيل الدخول</button><Link className="nav-pill mobile-nav" href="/">الرئيسية</Link></div>
    </nav>

    <section className="register-main">
      <header className="register-heading"><h1>إنشاء حساب جديد</h1><p>انضم إلى منصة أ/ معاذ وابدأ رحلتك التعليمية</p></header>
      <div className="register-stepper">{labels.map((label,i)=><div key={label} style={{display:'contents'}}><div className={`step-item ${i+1===step?'active':i+1<step?'done':''}`}><span className="step-dot">{i+1<step?'✓':i+1}</span><span>{label}</span></div>{i<labels.length-1&&<div className="step-line"/>}</div>)}</div>

      <div className="register-card">
        {step===1&&<form onSubmit={e=>{e.preventDefault();next()}}><div className="form-grid">
          <div className="field full"><label>الاسم بالكامل <em>*</em></label><input required value={form.name} onChange={e=>set('name',e.target.value)} placeholder="اكتب اسمك بالكامل"/></div>
          <div className="field"><label>تاريخ الميلاد <em>*</em></label><input required type="date" value={form.birthDate} onChange={e=>set('birthDate',e.target.value)}/><small>يجب أن يكون العمر 16 سنة أو أكثر</small></div>
          <div className="field"><label>رقم الهاتف <em>*</em></label><input required value={form.phone} onChange={e=>set('phone',e.target.value)} inputMode="tel" placeholder="01xxxxxxxxx"/></div>
          <div className="field full"><label>كلمة المرور <em>*</em></label><input required value={form.password} onChange={e=>set('password',e.target.value)} type="password" placeholder="8 أحرف على الأقل"/></div>
          {error&&<div className="error-box">{error}</div>}
        </div><div className="register-actions"><Link href="/" className="btn btn-secondary">العودة للرئيسية</Link><button className="btn btn-primary">التالي ←</button></div></form>}

        {step===2&&<form onSubmit={e=>{e.preventDefault();next()}}><div className="form-grid">
          <div className="field full"><label>رقم هاتف ولي الأمر <em>*</em></label><input required value={form.guardianPhone} onChange={e=>set('guardianPhone',e.target.value)} inputMode="tel" placeholder="01xxxxxxxxx"/></div>
          <div className="field"><label>المحافظة <em>*</em></label><input required value={form.governorate} onChange={e=>set('governorate',e.target.value)} placeholder="اختر المحافظة"/></div>
          <div className="field"><label>اسم المدرسة <em>*</em></label><input required value={form.school} onChange={e=>set('school',e.target.value)} placeholder="اسم المدرسة"/></div>
          <div className="field full"><label>المرحلة الدراسية <em>*</em></label><select required value={form.grade} onChange={e=>set('grade',e.target.value)}><option value="">اختر المرحلة</option>{grades.map(([label,value])=><option key={value} value={value}>{label}</option>)}</select></div>
          <div className="field full"><label>نوع الدراسة <em>*</em></label><div className="choice-row"><button type="button" className={`choice ${form.studyType==='ONLINE'?'selected':''}`} onClick={()=>set('studyType','ONLINE')}>أونلاين</button><button type="button" className={`choice ${form.studyType==='CENTER'?'selected':''}`} onClick={()=>set('studyType','CENTER')}>سنتر</button></div></div>
          {error&&<div className="error-box">{error}</div>}
        </div><div className="register-actions"><button type="button" onClick={()=>{setError('');setStep(1)}} className="btn btn-secondary">السابق</button><button className="btn btn-primary">التالي ←</button></div></form>}

        {step===3&&<div><div className="photo-box"><div className="photo-placeholder">👤</div><h3 style={{margin:'0 0 6px',fontWeight:950}}>الصورة الشخصية</h3><p style={{margin:0,color:'#91889c',fontSize:12,fontWeight:700}}>الصورة اختيارية حاليًا ويمكن إضافتها من الملف الشخصي لاحقًا.</p></div><div className="review" style={{marginTop:18}}><div className="review-row"><span>الاسم</span><strong>{form.name}</strong></div><div className="review-row"><span>المرحلة</span><strong>{form.grade}</strong></div><div className="review-row"><span>المحافظة</span><strong>{form.governorate}</strong></div><div className="review-row"><span>نوع الدراسة</span><strong>{form.studyType==='ONLINE'?'أونلاين':'سنتر'}</strong></div></div>{error&&<div className="error-box" style={{marginTop:14}}>{error}</div>}<div className="register-actions"><button type="button" onClick={()=>{setError('');setStep(2)}} className="btn btn-secondary">السابق</button><button disabled={loading} onClick={submit} className="btn btn-primary">{loading?'جاري إنشاء الحساب...':'إنشاء الحساب ✓'}</button></div></div>}
      </div>
      <div className="register-footer">بإنشائك للحساب أنت توافق على شروط الاستخدام وسياسة الخصوصية.</div>
    </section>
  </main>
}
