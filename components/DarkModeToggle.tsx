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
    const next = !document.documentElement.classList.contains('dark-mode')
    document.documentElement.classList.toggle('dark-mode', next)
    localStorage.setItem('eng-moaaz-theme', next ? 'dark' : 'light')
    setDark(next)
  }

  return (
    <>
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
      <style jsx>{`
        .dark-mode-toggle{
          position:fixed;
          top:16px;
          left:calc((100vw - min(1360px, calc(100vw - 48px))) / 2 + 280px);
          width:46px;
          height:46px;
          min-width:46px;
          padding:0;
          border:1px solid #e4dce9;
          border-radius:50%;
          background:#fff;
          color:#6d2fa3;
          display:flex;
          align-items:center;
          justify-content:center;
          cursor:pointer;
          z-index:1001;
          box-shadow:0 5px 14px rgba(53,27,76,.10);
          transition:transform .2s ease, background .25s ease, color .25s ease, border-color .25s ease;
          appearance:none;
          -webkit-appearance:none;
        }
        .dark-mode-toggle:hover{transform:translateY(-2px)}
        .dark-mode-toggle:focus-visible{outline:3px solid rgba(124,58,237,.22);outline-offset:2px}
        .dark-mode-toggle svg{width:21px;height:21px;display:block;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
        :global(html.dark-mode) .dark-mode-toggle{background:#24202d;color:#ffd76a;border-color:#40364d}
        @media(max-width:1100px){.dark-mode-toggle{left:24px}}
        @media(max-width:820px){.dark-mode-toggle{top:12px;left:16px;width:42px;height:42px;min-width:42px}}
        @media(max-width:680px){.dark-mode-toggle{width:40px;height:40px;min-width:40px}}
      `}</style>
    </>
  )
}
