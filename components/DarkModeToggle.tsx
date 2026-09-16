'use client'

import { useEffect, useState } from 'react'

export default function DarkModeToggle() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('eng-moaaz-theme')
    const initial = saved === 'dark'
    setDark(initial)
    document.documentElement.classList.toggle('dark-mode', initial)
  }, [])

  function toggleTheme() {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark-mode', next)
    localStorage.setItem('eng-moaaz-theme', next ? 'dark' : 'light')
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={dark ? 'تفعيل الوضع النهاري' : 'تفعيل الوضع الليلي'}
      title={dark ? 'الوضع النهاري' : 'الوضع الليلي'}
      className="dark-mode-toggle"
    >
      {dark ? (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      ) : (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M20.5 15.3A8.5 8.5 0 1 1 8.7 3.5 8.5 8.5 0 0 0 20.5 15.3Z" />
        </svg>
      )}
      <style jsx global>{`
        .site-header .dark-mode-toggle{
          width:42px!important;
          height:42px!important;
          min-width:42px!important;
          flex:0 0 42px!important;
          padding:0!important;
          margin:0!important;
          border:1px solid #e4dce9!important;
          border-radius:50%!important;
          background:#fff!important;
          color:#6d2fa3!important;
          display:inline-flex!important;
          align-items:center!important;
          justify-content:center!important;
          cursor:pointer!important;
          box-shadow:0 5px 14px rgba(53,27,76,.10)!important;
          transition:transform .2s ease,background .25s ease,color .25s ease,border-color .25s ease!important;
          appearance:none!important;
          -webkit-appearance:none!important;
          position:relative!important;
          z-index:200!important;
          overflow:visible!important;
        }
        .site-header .dark-mode-toggle:hover{transform:translateY(-2px)!important}
        .site-header .dark-mode-toggle:focus-visible{outline:3px solid rgba(124,58,237,.22)!important;outline-offset:2px!important}
        .site-header .dark-mode-toggle svg{width:20px!important;height:20px!important;display:block!important;stroke:currentColor!important;stroke-width:2!important;stroke-linecap:round!important;stroke-linejoin:round!important}
        html.dark-mode .site-header .dark-mode-toggle{background:#24202d!important;color:#ffd76a!important;border-color:#40364d!important}
        html.dark-mode,html.dark-mode body{background:#11101a;color:#f7f3fb}
        html.dark-mode body{--bg:#11101a;--white:#181622;--ink:#f7f3fb;--muted:#b9afc4;--line:#30283a}
        html.dark-mode .landing-page{background:linear-gradient(180deg,#11101a 0%,#171321 48%,#11101a 100%)}
        html.dark-mode .site-header-inner{background:rgba(24,22,34,.96)!important;border-color:#30283a!important;box-shadow:0 10px 28px rgba(0,0,0,.28)!important}
        html.dark-mode .main-nav{color:#eee8f5!important}
        html.dark-mode .main-nav a.active{color:#c99bf3!important}
        html.dark-mode .header-login{color:#eee8f5!important}
        html.dark-mode .header-register{background:#7b3eb0!important}
        html.dark-mode .hero-section{background:radial-gradient(circle at 18% 45%,#2a1b3d 0,#171522 42%,#11101a 100%)}
        html.dark-mode .hero-section:before{background:#291b3b;opacity:.75}
        html.dark-mode .hero-section:after{background:radial-gradient(circle,rgba(168,102,229,.18),transparent 70%)}
        html.dark-mode .hero-copy h1,html.dark-mode .platform-story-copy h2,html.dark-mode .stages-heading h2,html.dark-mode .grade-card h3{color:#f7f3fb!important}
        html.dark-mode .hero-copy p,html.dark-mode .platform-story-copy p,html.dark-mode .stages-heading p,html.dark-mode .grade-card p{color:#bdb4c8!important}
        html.dark-mode .hero-secondary,html.dark-mode .story-secondary{background:#211c29!important;color:#eee8f5!important;border-color:#40364d!important}
        html.dark-mode .hero-badge,html.dark-mode .platform-story-badge,html.dark-mode .stages-heading>span{background:#2a2036!important;border-color:#49355c!important;color:#d8b8f3!important}
        html.dark-mode .stages-section{background:linear-gradient(180deg,#11101a 0%,#171321 100%)}
        html.dark-mode .grade-card{background:#1b1823!important;border-color:#342c3e!important;box-shadow:0 15px 32px rgba(0,0,0,.25)!important}
        html.dark-mode .grade-card-body{background:#1b1823!important}
        html.dark-mode .grade-icon{border-color:#1b1823!important;background:#2a2036!important}
        html.dark-mode .platform-story-card{background:#1b1823!important;border-color:#382d45!important;color:#eee8f5!important}
        html.dark-mode .platform-story-card strong{color:#f7f3fb!important}
        html.dark-mode .platform-story-card small{color:#b9afc4!important}
        html.dark-mode .stats-strip{background:#1b1823!important;border-color:#342c3e!important;box-shadow:0 12px 30px rgba(0,0,0,.25)!important}
        html.dark-mode .why-section{background:#11101a!important}
        html.dark-mode .why-heading h2,html.dark-mode .feature-card h3{color:#f7f3fb!important}
        html.dark-mode .why-heading p,html.dark-mode .feature-card p{color:#bdb4c8!important}
        html.dark-mode .feature-card{background:#1b1823!important;border-color:#342c3e!important;box-shadow:0 12px 28px rgba(0,0,0,.2)!important}
        html.dark-mode .bottom-cta{background:linear-gradient(135deg,#21152f,#2b1a3d)!important;border-color:#463356!important}
        html.dark-mode .site-footer{background:#0d0c13!important;color:#b9afc4!important}
        html.dark-mode input,html.dark-mode select,html.dark-mode textarea{background:#1b1823!important;color:#f7f3fb!important;border-color:#40364d!important}
        html.dark-mode input::placeholder,html.dark-mode textarea::placeholder{color:#8f849a!important}
        @media(max-width:680px){.site-header .dark-mode-toggle{width:40px!important;height:40px!important;min-width:40px!important;flex-basis:40px!important}.site-header .dark-mode-toggle svg{width:19px!important;height:19px!important}}
      `}</style>
    </button>
  )
}
