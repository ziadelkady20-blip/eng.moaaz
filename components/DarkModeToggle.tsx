'use client'

import { useEffect } from 'react'

const moon = '<span aria-hidden="true" class="theme-icon">☾</span>'
const sun = '<span aria-hidden="true" class="theme-icon">☀</span>'

export default function DarkModeToggle() {
  useEffect(() => {
    const slot = document.querySelector('.site-header .theme-toggle') as HTMLElement | null
    if (!slot) return

    slot.removeAttribute('aria-hidden')
    slot.setAttribute('role', 'button')
    slot.setAttribute('tabindex', '0')
    slot.style.pointerEvents = 'auto'

    const apply = (dark: boolean) => {
      document.documentElement.classList.toggle('dark-mode', dark)
      localStorage.setItem('eng-moaaz-theme', dark ? 'dark' : 'light')
      slot.innerHTML = dark ? sun : moon
      slot.setAttribute('aria-label', dark ? 'تفعيل الوضع النهاري' : 'تفعيل الوضع الليلي')
      slot.setAttribute('title', dark ? 'الوضع النهاري' : 'الوضع الليلي')
    }

    const initial = localStorage.getItem('eng-moaaz-theme') === 'dark'
    apply(initial)

    const toggle = () => {
      const next = !document.documentElement.classList.contains('dark-mode')
      apply(next)
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        toggle()
      }
    }

    slot.addEventListener('click', toggle, true)
    slot.addEventListener('keydown', onKeyDown)

    return () => {
      slot.removeEventListener('click', toggle, true)
      slot.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  return (
    <style jsx global>{`
      .site-header .theme-toggle{
        width:46px!important;
        min-width:46px!important;
        height:46px!important;
        flex:0 0 46px!important;
        padding:0!important;
        margin:0!important;
        display:inline-flex!important;
        align-items:center!important;
        justify-content:center!important;
        position:relative!important;
        z-index:120!important;
        overflow:visible!important;
        pointer-events:auto!important;
        cursor:pointer!important;
        user-select:none!important;
        border:1px solid #e4dce9!important;
        border-radius:50%!important;
        background:#fff!important;
        color:#6d2fa3!important;
        box-shadow:0 5px 14px rgba(53,27,76,.10)!important;
        transition:transform .2s ease,background .25s ease,color .25s ease,border-color .25s ease!important;
      }
      .site-header .theme-toggle:hover{transform:translateY(-2px)!important}
      .site-header .theme-toggle:focus-visible{outline:3px solid rgba(124,58,237,.22)!important;outline-offset:2px!important}
      .site-header .theme-toggle .theme-icon{display:block!important;font-size:24px!important;line-height:1!important;font-family:Arial,sans-serif!important;font-weight:700!important}

      html.dark-mode,html.dark-mode body{background:#11101a;color:#f7f3fb}
      html.dark-mode body{--bg:#11101a;--white:#181622;--ink:#f7f3fb;--muted:#b9afc4;--line:#30283a}
      html.dark-mode .landing-page{background:linear-gradient(180deg,#11101a 0%,#171321 48%,#11101a 100%)}
      html.dark-mode .site-header-inner{background:rgba(24,22,34,.96)!important;border-color:#30283a!important;box-shadow:0 10px 28px rgba(0,0,0,.28)!important}
      html.dark-mode .main-nav{color:#eee8f5!important}
      html.dark-mode .main-nav a.active{color:#c99bf3!important}
      html.dark-mode .header-login{color:#eee8f5!important}
      html.dark-mode .header-register{background:#7b3eb0!important}
      html.dark-mode .site-header .theme-toggle{background:#24202d!important;color:#ffd76a!important;border-color:#40364d!important}
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

      @media(max-width:820px){.site-header .theme-toggle{width:42px!important;min-width:42px!important;height:42px!important;flex-basis:42px!important}}
      @media(max-width:680px){.site-header .theme-toggle{width:40px!important;min-width:40px!important;height:40px!important;flex-basis:40px!important}.site-header .theme-toggle .theme-icon{font-size:21px!important}}
    `}</style>
  )
}
