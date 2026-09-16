'use client'

import { useEffect, useState } from 'react'

const moonIcon = '<svg aria-hidden="true" viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M20.5 15.3A8.5 8.5 0 0 1 8.7 3.5 8.5 8.5 0 1 0 20.5 15.3Z"/></svg>'
const sunIcon = '<svg aria-hidden="true" viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>'

export default function DarkModeToggle() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('eng-moaaz-theme')
    const initial = saved === 'dark'
    setDark(initial)
    document.documentElement.classList.toggle('dark-mode', initial)

    const header = document.querySelector('.site-header')
    const actions = header?.querySelector('.header-actions')
    if (!actions || actions.querySelector('[data-dark-mode-toggle]')) return

    const button = document.createElement('button')
    button.type = 'button'
    button.setAttribute('data-dark-mode-toggle', 'true')
    button.setAttribute('aria-label', initial ? 'تفعيل الوضع النهاري' : 'تفعيل الوضع الليلي')
    button.title = initial ? 'الوضع النهاري' : 'الوضع الليلي'
    button.innerHTML = initial ? sunIcon : moonIcon

    button.onclick = () => {
      const next = !document.documentElement.classList.contains('dark-mode')
      document.documentElement.classList.toggle('dark-mode', next)
      localStorage.setItem('eng-moaaz-theme', next ? 'dark' : 'light')
      button.setAttribute('aria-label', next ? 'تفعيل الوضع النهاري' : 'تفعيل الوضع الليلي')
      button.title = next ? 'الوضع النهاري' : 'الوضع الليلي'
      button.innerHTML = next ? sunIcon : moonIcon
      setDark(next)
    }

    actions.insertBefore(button, actions.firstChild)
  }, [])

  useEffect(() => {
    const button = document.querySelector('[data-dark-mode-toggle]')
    if (button) button.innerHTML = dark ? sunIcon : moonIcon
  }, [dark])

  return <style jsx global>{`
    [data-dark-mode-toggle]{width:46px!important;height:46px!important;min-width:46px!important;flex:0 0 46px!important;border-radius:50%!important;border:1px solid #e4dce9!important;background:#fff!important;color:#6d2fa3!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;padding:0!important;margin:0!important;cursor:pointer!important;font:inherit!important;line-height:0!important;box-shadow:0 5px 14px rgba(53,27,76,.07)!important;transition:transform .2s ease,background .25s ease,color .25s ease,border-color .25s ease!important;position:relative!important;z-index:20!important}
    [data-dark-mode-toggle] svg{width:21px!important;height:21px!important;display:block!important;stroke:currentColor!important;fill:none!important}
    [data-dark-mode-toggle]:hover{transform:translateY(-2px)!important}
    html.dark-mode,html.dark-mode body{background:#11101a;color:#f7f3fb}
    html.dark-mode body{--bg:#11101a;--white:#181622;--ink:#f7f3fb;--muted:#b9afc4;--line:#30283a}
    html.dark-mode .landing-page{background:linear-gradient(180deg,#11101a 0%,#171321 48%,#11101a 100%)}
    html.dark-mode .site-header{background:rgba(24,22,34,.94);border-color:#30283a;box-shadow:0 7px 24px rgba(0,0,0,.25)}
    html.dark-mode .main-nav{color:#eee8f5}
    html.dark-mode .main-nav a.active{color:#c99bf3}
    html.dark-mode .header-login{color:#eee8f5}
    html.dark-mode [data-dark-mode-toggle]{background:#24202d!important;color:#ffd76a!important;border-color:#40364d!important}
    html.dark-mode .hero-section{background:radial-gradient(circle at 18% 45%,#2a1b3d 0,#171522 42%,#11101a 100%)}
    html.dark-mode .hero-section:before{background:#291b3b;opacity:.75}
    html.dark-mode .hero-section:after{background:radial-gradient(circle,rgba(168,102,229,.18),transparent 70%)}
    html.dark-mode .hero-copy h1,html.dark-mode .platform-story-copy h2,html.dark-mode .stages-heading h2,html.dark-mode .grade-card h3{color:#f7f3fb}
    html.dark-mode .hero-copy p,html.dark-mode .platform-story-copy p,html.dark-mode .stages-heading p,html.dark-mode .grade-card p{color:#bdb4c8}
    html.dark-mode .hero-secondary,html.dark-mode .story-secondary{background:#211c29;color:#eee8f5;border-color:#40364d}
    html.dark-mode .hero-badge,html.dark-mode .platform-story-badge,html.dark-mode .stages-heading>span{background:#2a2036;border-color:#49355c;color:#d8b8f3}
    html.dark-mode .stages-section{background:linear-gradient(180deg,#11101a 0%,#171321 100%)}
    html.dark-mode .grade-card{background:#1b1823;border-color:#342c3e;box-shadow:0 15px 32px rgba(0,0,0,.25)}
    html.dark-mode .grade-card-body{background:#1b1823}
    html.dark-mode .grade-icon{border-color:#1b1823;background:#2a2036}
    html.dark-mode .platform-story-card{background:#1b1823;border-color:#382d45;color:#eee8f5}
    html.dark-mode .platform-story-card strong{color:#f7f3fb}
    html.dark-mode .platform-story-card small{color:#b9afc4}
    html.dark-mode .stats-strip{background:#1b1823;border-color:#342c3e;box-shadow:0 12px 30px rgba(0,0,0,.25)}
    html.dark-mode .why-section{background:#11101a}
    html.dark-mode .why-heading h2,html.dark-mode .feature-card h3{color:#f7f3fb}
    html.dark-mode .why-heading p,html.dark-mode .feature-card p{color:#bdb4c8}
    html.dark-mode .feature-card{background:#1b1823;border-color:#342c3e;box-shadow:0 12px 28px rgba(0,0,0,.2)}
    html.dark-mode .bottom-cta{background:linear-gradient(135deg,#21152f,#2b1a3d);border-color:#463356}
    html.dark-mode .site-footer{background:#0d0c13;color:#b9afc4}
    html.dark-mode input,html.dark-mode select,html.dark-mode textarea{background:#1b1823;color:#f7f3fb;border-color:#40364d}
    html.dark-mode input::placeholder,html.dark-mode textarea::placeholder{color:#8f849a}
    @media(max-width:900px){[data-dark-mode-toggle]{width:42px!important;height:42px!important;min-width:42px!important;flex-basis:42px!important}}
    @media(max-width:680px){[data-dark-mode-toggle]{width:40px!important;height:40px!important;min-width:40px!important;flex-basis:40px!important}}
  `}</style>
}
