import Link from 'next/link'

const grades = [
  { title: 'الصف الأول\nالثانوي العام', icon: '▢' },
  { title: 'الصف الثاني\nالثانوي العام', icon: '▤' },
  { title: 'الصف الثالث\nالثانوي العام', icon: '⌂' },
]

const features = [
  ['▣', 'شرح احترافي', 'فيديوهات عالية الجودة'],
  ['✓', 'اختبارات دورية', 'تقييم مستمر لمستواك'],
  ['▤', 'كتب وملخصات حصرية', 'تحميل مباشر بجودة عالية'],
  ['♟', 'دعم فني مستمر', 'فريق دعم متاح دائمًا'],
  ['♟', 'مجتمع طلابي قوي', 'كن جزء من مجتمع من الطلاب المتفوقين'],
  ['♧', 'متابعة ولي الأمر', 'تابع مستوى ابنك أول بأول'],
]

const uiStyles = `
.brand-lockup{display:flex;align-items:center;gap:10px;direction:rtl}.brand-badge{width:44px;height:44px;border-radius:13px;background:linear-gradient(145deg,#6d2fa3,#8b5cf6);display:grid;place-items:center;color:#fff;font-size:17px;font-weight:1000;box-shadow:0 8px 20px rgba(109,47,163,.2)}.brand-copy{display:flex;flex-direction:column;line-height:1.05}.brand-copy strong{font-size:14px;letter-spacing:.2px;color:#241a2d;font-weight:1000}.brand-copy span{font-size:10px;color:#76518e;font-weight:800;margin-top:4px}.hero-section{min-height:510px;background:radial-gradient(circle at 18% 50%,#f5edff 0,#fff 36%,#fff 100%)}.hero-inner{min-height:510px;grid-template-columns:1fr 1fr;gap:42px}.hero-visual{height:510px;justify-content:center;overflow:visible}.hero-art{width:min(510px,100%);height:510px;object-fit:contain;object-position:center;transform:none;border-radius:28px;filter:drop-shadow(0 24px 35px rgba(62,26,92,.14))}.hero-copy{padding:42px 0 34px}.hero-copy h1{font-size:60px;line-height:1.08;letter-spacing:-2px}.hero-copy p{max-width:600px;font-size:17px;line-height:1.95}.hero-badge{box-shadow:0 7px 20px rgba(109,47,163,.08)}.hero-buttons{margin-top:25px}.hero-primary{min-width:150px}.hero-secondary{min-width:165px}.hero-trust{margin-top:27px}.site-header{height:82px}.site-header-inner{width:min(1460px,calc(100% - 56px));gap:30px}.header-brand{width:250px}.header-brand img{display:none}.main-nav{gap:34px}.header-actions{width:300px}.stages-section{padding-top:24px}.stages-inner{padding:22px 30px;border-radius:26px}.grade-card{height:126px}.why-section{padding-top:28px}.feature-card{min-height:132px;padding:17px}.bottom-cta{min-height:116px;border-radius:22px}
@media(max-width:1100px){.hero-inner{grid-template-columns:1fr 1fr;gap:20px}.hero-copy h1{font-size:48px}.hero-art{width:100%;height:460px}.hero-visual{height:460px}.main-nav{gap:18px}.header-brand{width:210px}}
@media(max-width:760px){.site-header{height:68px}.header-brand{width:auto}.hero-inner{grid-template-columns:1fr;min-height:auto}.hero-visual{height:370px;order:1}.hero-art{width:min(370px,100%);height:370px}.hero-copy{order:2;padding:18px 0 30px}.hero-copy h1{font-size:42px}.hero-copy p{font-size:15px}.brand-copy strong{font-size:12px}.brand-badge{width:38px;height:38px}.features-grid{grid-template-columns:repeat(2,1fr)}}
`

export default function Home() {
  return (
    <main className="landing-page">
      <style>{uiStyles}</style>
      <header className="site-header">
        <div className="site-header-inner">
          <div className="header-brand">
            <div className="brand-lockup">
              <div className="brand-badge">EM</div>
              <div className="brand-copy"><strong>ENG MOAAZ ISMAIL</strong><span>منصة معاذ إسماعيل التعليمية</span></div>
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
            <p>مع Eng Moaaz Ismail هتتعلم بطريقة مختلفة.. شرح مبسط، محتوى احترافي، متابعة مستمرة، واختبارات شاملة تساعدك تحقق أعلى درجاتك في الثانوية العامة.</p>
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
            <img src="/hero.jpeg" alt="Eng Moaaz Ismail" className="hero-art" />
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
                <div className="grade-icon">{grade.icon}</div>
                <h3>{grade.title.split('\n').map((line) => <span key={line}>{line}<br /></span>)}</h3>
                <b>←</b>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="stats-strip" aria-label="إحصائيات المنصة">
        <div><strong>+50,000</strong><span>طالب وطالبة</span><em>♟</em></div>
        <div><strong>+150</strong><span>كورس تعليمي</span><em>▤</em></div>
        <div><strong>+1,200</strong><span>ساعة شرح مسجلة</span><em>▣</em></div>
        <div><strong>+98%</strong><span>نسبة رضا الطلاب</span><em>♡</em></div>
      </section>

      <section id="about" className="why-section">
        <div className="why-heading">
          <h2>ليه تختار منصة <span>Eng Moaaz Ismail</span> ؟</h2>
          <p>كل ما تحتاجه في مكان واحد لتحقيق أعلى درجاتك</p>
        </div>
        <div className="features-grid">
          {features.map(([icon, title, desc]) => (
            <article className="feature-card" key={title}>
              <div className="feature-icon">{icon}</div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bottom-cta" id="contact">
        <div className="cta-brand"><div className="brand-lockup"><div className="brand-badge">EM</div><div className="brand-copy"><strong style={{color:'#fff'}}>ENG MOAAZ ISMAIL</strong><span style={{color:'#dfd0ed'}}>منصة معاذ إسماعيل التعليمية</span></div></div></div>
        <div className="cta-copy"><strong>مستقبلك يبدأ بقرار .. ابدأ الآن مع Eng Moaaz Ismail</strong><span>انضم إلى آلاف الطلاب وابدأ رحلتك نحو التفوق في الثانوية العامة</span></div>
        <Link href="/register" className="cta-button">إنشاء حساب الآن <span>←</span></Link>
        <div className="cta-side">مجهودك اليوم..<br /><b>هو مستقبلك غدًا</b></div>
      </section>
      <footer className="site-footer">
        <span>© Eng Moaaz Ismail</span>
        <span>الشروط • الخصوصية • الدعم</span>
      </footer>
    </main>
  )
}
