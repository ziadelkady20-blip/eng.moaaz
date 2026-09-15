import Link from 'next/link'

type IconName = 'book' | 'cap' | 'headset' | 'video' | 'chart' | 'target' | 'users' | 'heart' | 'document' | 'check'

function Icon({name}:{name:IconName}) {
  const common={width:28,height:28,viewBox:'0 0 32 32',fill:'none',stroke:'currentColor',strokeWidth:1.9,strokeLinecap:'round' as const,strokeLinejoin:'round' as const}
  if(name==='cap') return <svg {...common}><path d="M3.5 12.2 16 5l12.5 7.2L16 19.4 3.5 12.2Z"/><path d="M8 15.1v6.2c4.8 3.1 11.2 3.1 16 0v-6.2"/><path d="M28.5 12.2v7.2"/></svg>
  if(name==='book') return <svg {...common}><path d="M5 6.5c4.3-1.4 7.7-.7 11 1.7v18c-3.3-2.4-6.7-3.1-11-1.7v-18Z"/><path d="M27 6.5c-4.3-1.4-7.7-.7-11 1.7v18c3.3-2.4 6.7-3.1 11-1.7v-18Z"/><path d="M16 8.2v18"/></svg>
  if(name==='headset') return <svg {...common}><path d="M5 18v-3a11 11 0 0 1 22 0v3"/><path d="M5 18h4v8H6.5A1.5 1.5 0 0 1 5 24.5V18Z"/><path d="M27 18h-4v8h2.5a1.5 1.5 0 0 0 1.5-1.5V18Z"/><path d="M23 27c-1.8 1.2-4.1 1.8-7 1.8"/></svg>
  if(name==='video') return <svg {...common}><rect x="4" y="6" width="24" height="20" rx="4"/><path d="m13 11 8 5-8 5v-10Z"/></svg>
  if(name==='chart') return <svg {...common}><path d="M6 25V17"/><path d="M13 25V12"/><path d="M20 25V7"/><path d="M27 25V4"/><path d="M4 27h25"/></svg>
  if(name==='target') return <svg {...common}><circle cx="16" cy="16" r="11"/><circle cx="16" cy="16" r="6"/><circle cx="16" cy="16" r="1.5"/><path d="m22.5 9.5 5-5"/><path d="M23 4h4.5v4.5"/></svg>
  if(name==='users') return <svg {...common}><circle cx="16" cy="10" r="4"/><path d="M8 27v-2a8 8 0 0 1 16 0v2"/><path d="M7 15a4 4 0 0 0-4 4v2"/><path d="M25 15a4 4 0 0 1 4 4v2"/></svg>
  if(name==='heart') return <svg {...common}><path d="M16 27S5 20.5 5 12.7C5 9 7.6 6.5 11 6.5c2.2 0 4 1.1 5 2.7 1-1.6 2.8-2.7 5-2.7 3.4 0 6 2.5 6 6.2C27 20.5 16 27 16 27Z"/></svg>
  if(name==='check') return <svg {...common}><rect x="5" y="4" width="22" height="24" rx="4"/><path d="m10 16 4 4 8-9"/></svg>
  return <svg {...common}><path d="M8 5h16v22H8z"/><path d="M11 10h10M11 15h10M11 20h7"/></svg>
}

const grades = [
  { title: 'الصف الأول\nالثانوي العام', icon: 'book' as IconName },
  { title: 'الصف الثاني\nالثانوي العام', icon: 'book' as IconName },
  { title: 'الصف الثالث\nالثانوي العام', icon: 'cap' as IconName },
]

const features = [
  ['video', 'شرح احترافي', 'فيديوهات عالية الجودة'],
  ['check', 'اختبارات دورية', 'تقييم مستمر لمستواك'],
  ['document', 'كتب وملخصات حصرية', 'تحميل مباشر بجودة عالية'],
  ['headset', 'دعم فني مستمر', 'فريق دعم متاح دائمًا'],
  ['users', 'مجتمع طلابي قوي', 'كن جزء من مجتمع من الطلاب المتفوقين'],
  ['users', 'متابعة ولي الأمر', 'تابع مستوى ابنك أول بأول'],
] as const

const uiStyles = `
.brand-lockup{display:flex;align-items:center;gap:10px;direction:rtl}.brand-logo{width:50px;height:50px;flex:0 0 50px;display:block;object-fit:cover;border-radius:15px;box-shadow:0 5px 16px rgba(44,20,72,.14);border:1px solid rgba(109,47,163,.12)}.brand-copy{display:flex;flex-direction:column;line-height:1.08}.brand-copy strong{font-size:15px;letter-spacing:0;color:#241a2d;font-weight:1000}.brand-copy span{font-size:10px;color:#76518e;font-weight:800;margin-top:5px}.hero-section{min-height:450px;background:radial-gradient(circle at 18% 50%,#f5edff 0,#fff 36%,#fff 100%)}.hero-inner{min-height:450px;grid-template-columns:minmax(0,.92fr) minmax(0,1.08fr);gap:34px}.hero-visual{height:auto;min-height:0;justify-content:center;overflow:visible}.hero-art{width:100%;max-width:860px;height:auto;aspect-ratio:2048/758;object-fit:cover;object-position:center;border-radius:20px;filter:drop-shadow(0 18px 30px rgba(62,26,92,.12))}.hero-copy{padding:30px 0 28px}.hero-copy h1{font-size:56px;line-height:1.08;letter-spacing:-1.8px}.hero-copy p{max-width:600px;font-size:17px;line-height:1.9}.hero-badge{box-shadow:0 7px 20px rgba(109,47,163,.08)}.hero-buttons{margin-top:22px}.hero-primary{min-width:150px}.hero-secondary{min-width:165px}.hero-trust{margin-top:24px}.site-header{height:82px}.site-header-inner{width:min(1460px,calc(100% - 56px));gap:30px}.header-brand{width:260px}.main-nav{gap:34px}.header-actions{width:300px}.stages-section{padding-top:24px}.stages-inner{padding:22px 30px;border-radius:26px}.grade-card{height:126px}.grade-icon,.feature-icon{display:grid;place-items:center;color:#6d2fa3}.grade-icon{width:54px;height:54px;border-radius:16px;background:#faf5ff}.grade-icon svg{width:36px;height:36px;stroke-width:1.7}.feature-icon{width:48px;height:48px;margin:0 auto 8px;border-radius:14px;background:#faf5ff}.feature-icon svg{width:27px;height:27px}.stats-strip em{display:grid;place-items:center;font-style:normal}.stats-strip em svg{width:28px;height:28px}.why-section{padding-top:28px}.feature-card{min-height:132px;padding:17px}.bottom-cta{min-height:116px;border-radius:22px}.cta-brand .brand-logo{border-color:rgba(255,255,255,.25)}.cta-brand .brand-copy strong{font-size:14px}.cta-brand .brand-copy span{font-size:10px}
@media(max-width:1100px){.hero-inner{grid-template-columns:1fr 1fr;gap:20px}.hero-copy h1{font-size:48px}.hero-art{width:100%;height:auto}.main-nav{gap:18px}.header-brand{width:230px}.brand-logo{width:44px;height:44px;flex-basis:44px}}
@media(max-width:760px){.site-header{height:68px}.header-brand{width:auto}.hero-inner{grid-template-columns:1fr;min-height:auto}.hero-visual{height:auto;order:1}.hero-art{width:100%;max-width:100%;height:auto;border-radius:16px}.hero-copy{order:2;padding:18px 0 30px}.hero-copy h1{font-size:42px}.hero-copy p{font-size:15px}.brand-copy strong{font-size:12px}.brand-logo{width:40px;height:40px;flex-basis:40px}.features-grid{grid-template-columns:repeat(2,1fr)}}
`

export default function Home() {
  return (
    <main className="landing-page">
      <style>{uiStyles}</style>
      <header className="site-header">
        <div className="site-header-inner">
          <div className="header-brand">
            <div className="brand-lockup">
              <img src="/logo.jpeg" alt="برمجها مع معاذ" className="brand-logo" />
              <div className="brand-copy"><strong>برمجها مع معاذ</strong><span>معًا نحقق نجاحك</span></div>
            </div>
          </div>
          <nav className="main-nav" aria-label="التنقل الرئيسي">
            <a className="active" href="#home">الرئيسية</a>
            <a href="#courses">الكورسات</a>
            <a href="#books">الكتب</a>
            <a href="#stages">المراحل</a>
            <a href="#about">عن المنصة</a>
            <a href="#teachers">السناتر</a>
            <a href="#contact">تواصل معنا</a>
          </nav>
          <div className="header-actions">
            <span className="theme-toggle" aria-hidden="true"><span /></span>
            <Link href="/login" className="header-login">تسجيل الدخول <span>♙</span></Link>
            <Link href="/register" className="header-register">إنشاء حساب <span>◈</span></Link>
          </div>
        </div>
      </header>

      <section id="home" className="hero-section">
        <div className="hero-inner">
          <div className="hero-copy">
            <div className="hero-badge">🎓 المنصة التعليمية الأقوى لطلاب الثانوية العامة</div>
            <h1>رحلتك للنجاح<br /><span>تبدأ من هنا</span></h1>
            <p>مع برمجها مع معاذ هتتعلم بطريقة مختلفة.. شرح مبسط، محتوى احترافي، متابعة مستمرة، واختبارات شاملة تساعدك تحقق أعلى درجاتك في الثانوية العامة.</p>
            <div className="hero-buttons">
              <Link href="/register" className="hero-primary">ابدأ الآن <span>←</span></Link>
              <a href="#stages" className="hero-secondary">استكشف الكورسات</a>
            </div>
            <div className="hero-trust">
              <div className="trust-item"><div className="avatars"><i /><i /><i /></div><div><strong>+50,000</strong><small>طالب بيثقوا في المنصة</small></div></div>
              <div className="trust-item rating"><strong>4.9</strong><span>★★★★★</span><small>تقييم الطلاب للمنصة</small></div>
            </div>
          </div>
          <div className="hero-visual">
            <img src="/hero.jpeg" alt="برمجها مع معاذ" className="hero-art" />
          </div>
        </div>
      </section>

      <section id="stages" className="stages-section">
        <div className="stages-inner">
          <div className="stages-heading">
            <span>الثانوية العامة</span>
            <h2>اختر مرحلتك الدراسية</h2>
            <p>ابدأ رحلتك الآن واختر الصف الخاص بك</p>
          </div>
          <div className="grade-cards">
            {grades.map((grade) => (
              <Link href="/register" className="grade-card" key={grade.title}>
                <div className="grade-icon"><Icon name={grade.icon} /></div>
                <h3>{grade.title.split('\n').map((line) => <span key={line}>{line}<br /></span>)}</h3>
                <b>←</b>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="stats-strip" aria-label="إحصائيات المنصة">
        <div><strong>+50,000</strong><span>طالب وطالبة</span><em><Icon name="users" /></em></div>
        <div><strong>+150</strong><span>كورس تعليمي</span><em><Icon name="book" /></em></div>
        <div><strong>+1,200</strong><span>ساعة شرح مسجلة</span><em><Icon name="video" /></em></div>
        <div><strong>+98%</strong><span>نسبة رضا الطلاب</span><em><Icon name="heart" /></em></div>
      </section>

      <section id="about" className="why-section">
        <div className="why-heading">
          <h2>ليه تختار منصة <span>برمجها مع معاذ</span> ؟</h2>
          <p>كل ما تحتاجه في مكان واحد لتحقيق أعلى درجاتك</p>
        </div>
        <div className="features-grid">
          {features.map(([icon, title, desc]) => (
            <article className="feature-card" key={title}>
              <div className="feature-icon"><Icon name={icon} /></div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bottom-cta" id="contact">
        <div className="cta-brand"><div className="brand-lockup"><img src="/logo.jpeg" alt="برمجها مع معاذ" className="brand-logo" /><div className="brand-copy"><strong style={{color:'#fff'}}>برمجها مع معاذ</strong><span style={{color:'#dfd0ed'}}>معًا نحقق نجاحك</span></div></div></div>
        <div className="cta-copy"><strong>مستقبلك يبدأ بقرار .. ابدأ الآن مع برمجها مع معاذ</strong><span>انضم إلى آلاف الطلاب وابدأ رحلتك نحو التفوق في الثانوية العامة</span></div>
        <Link href="/register" className="cta-button">إنشاء حساب الآن <span>←</span></Link>
        <div className="cta-side">مجهودك اليوم..<br /><b>هو مستقبلك غدًا</b></div>
      </section>
      <footer className="site-footer">
        <span>© برمجها مع معاذ</span>
        <span>الشروط • الخصوصية • الدعم</span>
      </footer>
    </main>
  )
}
