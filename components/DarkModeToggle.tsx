'use client'

import { createPortal } from 'react-dom'
import { useEffect, useState } from 'react'

export default function DarkModeToggle() {
  const [dark, setDark] = useState(false)
  const [target, setTarget] = useState<HTMLElement | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('eng-moaaz-theme')
    const initial = saved === 'dark'
    setDark(initial)
    document.documentElement.classList.toggle('dark-mode', initial)

    const headerSlot = document.querySelector('.theme-toggle') as HTMLElement | null
    if (headerSlot) {
      headerSlot.removeAttribute('aria-hidden')
      setTarget(headerSlot)
    }
  }, [])

  function toggleTheme() {
    const next = !document.documentElement.classList.contains('dark-mode')
    document.documentElement.classList.toggle('dark-mode', next)
    localStorage.setItem('eng-moaaz-theme', next ? 'dark' : 'light')
    setDark(next)
  }

  const button = (
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
    </button>
  )

  return (
    <>
      {target && createPortal(button, target)}
      <style jsx global>{`
        .site-header .theme-toggle{
          width:46px!important;
          min-width:46px!important;
          height:46px!important;
          display:inline-flex!important;
          align-items:center!important;
          justify-content:center!important;
          flex:0 0 46px!important;
          padding:0!important;
          margin:0!important;
          position:relative!important;
          overflow:visible!important;
          background:transparent!important;
          border:0!important;
        }
        .site-header .theme-toggle .dark-mode-toggle{
          position:relative!important;
          inset:auto!important;
          top:auto!important;
          left:auto!important;
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
          z-index:100!important;
          box-shadow:0 5px 14px rgba(53,27,76,.10)!important;
          appearance:none!important;
          -webkit-appearance:none!important;
        }
        .site-header .theme-toggle .dark-mode-toggle svg{width:20px!important;height:20px!important;display:block!important;stroke:currentColor!important;stroke-width:2!important;stroke-linecap:round!important;stroke-linejoin:round!important}
        .site-header .theme-toggle .dark-mode-toggle:hover{transform:translateY(-2px)!important}
        html.dark-mode .site-header .theme-toggle .dark-mode-toggle{background:#24202d!important;color:#ffd76a!important;border-color:#40364d!important}
        @media(max-width:820px){.site-header .theme-toggle{width:42px!important;min-width:42px!important;height:42px!important;flex-basis:42px!important}.site-header .theme-toggle .dark-mode-toggle{width:40px!important;height:40px!important;min-width:40px!important;flex-basis:40px!important}}
      `}</style>
    </>
  )
}
