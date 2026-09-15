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

export default function Home() {
  return (
    <main className="landing-page">
      <header className="site-header">
        <div className="site-header-inner">
          <div className="header-brand">
            <img src="/brand-logo.png" alt="Eng Moaaz Ismail" />
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
            <img src="/hero-real.svg" alt="Eng Moaaz Ismail platform" className="hero-art" style={{width:'100%',height:'auto',objectFit:'contain',objectPosition:'center',transform:'none'}} />
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
        <div className="cta-brand"><img src="/brand-logo.png" alt="Eng Moaaz Ismail" /></div>
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
