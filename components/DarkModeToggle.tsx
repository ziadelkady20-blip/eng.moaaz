'use client'

import { useEffect } from 'react'

const moonIcon = '<svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M20.5 15.3A8.5 8.5 0 0 1 8.7 3.5 8.5 8.5 0 1 0 20.5 15.3Z"/></svg>'
const sunIcon = '<svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41 1.41"/></svg>'

function renderTheme(slot: HTMLElement, dark: boolean) {
  slot.innerHTML = dark ? sunIcon : moonIcon
  slot.setAttribute('data-dark-mode-toggle', 'true')
  slot.setAttribute('role', 'button')
  slot.setAttribute('tabindex', '0')
  slot.setAttribute('aria-label', dark ? 'تفعيل الوضع النهاري' : 'تفعيل الوضع الليلي')
  slot.setAttribute('title', dark ? 'الوضع النهاري' : 'الوضع الليلي')
  slot.setAttribute('aria-hidden', 'false')
}

export default function DarkModeToggle() {
  useEffect(() => {
    let slot: HTMLElement | null = null

    const apply = (dark: boolean) => {
      document.documentElement.classList.toggle('dark-mode', dark)
      localStorage.setItem('eng-moaaz-theme', dark ? 'dark' : 'light')
      if (slot) renderTheme(slot, dark)
    }

    const setup = () => {
      slot = document.querySelector('.site-header .theme-toggle') as HTMLElement | null
      if (!slot) return false
      renderTheme(slot, document.documentElement.classList.contains('dark-mode'))
      return true
    }

    const initial = localStorage.getItem('eng-moaaz-theme') === 'dark'
    apply(initial)
    setup()

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      const themeButton = target?.closest('.site-header .theme-toggle') as HTMLElement | null
      if (!themeButton) return
      event.preventDefault()
      event.stopPropagation()
      apply(!document.documentElement.classList.contains('dark-mode'))
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      const themeButton = target?.closest('.site-header .theme-toggle') as HTMLElement | null
      if (!themeButton || (event.key !== 'Enter' && event.key !== ' ')) return
      event.preventDefault()
      apply(!document.documentElement.classList.contains('dark-mode'))
    }

    document.addEventListener('click', handleClick, true)
    document.addEventListener('keydown', handleKeyDown, true)

    const observer = new MutationObserver(() => {
      const current = document.querySelector('.site-header .theme-toggle') as HTMLElement | null
      if (current && current !== slot) {
        slot = current
        renderTheme(slot, document.documentElement.classList.contains('dark-mode'))
      }
    })
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      document.removeEventListener('click', handleClick, true)
      document.removeEventListener('keydown', handleKeyDown, true)
      observer.disconnect()
    }
  }, [])

  return (
    <style jsx global>{`
      .site-header .theme-toggle{
        width:46px!important;
        min-width:46px!important;
        height:46px!important;
        flex:0 0 46px!important;
        display:flex!important;
        align-items:center!important;
        justify-content:center!important;
        position:relative!important;
        padding:0!important;
        margin:0!important;
        border:1px solid #e4dce9!important;
        border-radius:50%!important;
        background:#fff!important;
        color:#6d2fa3!important;
        cursor:pointer!important;
        overflow:hidden!important;
        z-index:100!important;
        box-shadow:0 5px 14px rgba(53,27,76,.10)!important;
        transition:transform .2s ease,background .25s ease,color .25s ease,border-color .25s ease!important;
      }
      .site-header .theme-toggle:hover{transform:translateY(-2px)!important}
      .site-header .theme-toggle svg{width:20px!important;height:20px!important;display:block!important;stroke:currentColor!important;fill:none!important}
      html.dark-mode .site-header .theme-toggle{background:#24202d!important;color:#ffd76a!important;border-color:#40364d!important}
      @media(max-width:820px){.site-header .theme-toggle{width:40px!important;min-width:40px!important;height:40px!important;flex-basis:40px!important}}
    `}</style>
  )
}
