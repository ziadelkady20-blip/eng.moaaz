'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

function targetForRole(role: string) {
  if (role === 'ADMIN') return '/admin'
  if (role === 'TEACHER') return '/teacher'
  if (role === 'PARENT') return '/parent'
  if (role === 'SUPPORT') return '/support'
  return '/student'
}

export default function HomeAuthControls() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<{ name: string; role: string } | null>(null)
  const [host, setHost] = useState<HTMLElement | null>(null)

  useEffect(() => {
    if (pathname !== '/') {
      setUser(null)
      return
    }
    let active = true
    fetch('/api/auth/me', { cache: 'no-store' })
      .then(async response => (response.ok ? response.json() : null))
      .then(data => {
        if (active) setUser(data?.user ?? null)
      })
      .catch(() => active && setUser(null))
    return () => {
      active = false
    }
  }, [pathname])

  useEffect(() => {
    if (pathname !== '/' || !user) {
      setHost(null)
      return
    }
    const actions = document.querySelector<HTMLElement>('.site-header .header-actions')
    if (!actions) return

    const login = actions.querySelector<HTMLElement>('.header-login')
    const register = actions.querySelector<HTMLElement>('.header-register')
    if (login) login.style.display = 'none'
    if (register) register.style.display = 'none'

    let holder = actions.querySelector<HTMLElement>('[data-auth-controls]')
    if (!holder) {
      holder = document.createElement('div')
      holder.dataset.authControls = 'true'
      holder.style.display = 'flex'
      holder.style.alignItems = 'center'
      holder.style.gap = '8px'
      holder.style.direction = 'rtl'
      actions.appendChild(holder)
    }
    setHost(holder)

    return () => {
      if (login) login.style.display = ''
      if (register) register.style.display = ''
      holder?.remove()
      setHost(null)
    }
  }, [pathname, user])

  if (!user || !host || pathname !== '/') return null

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    router.refresh()
  }

  return createPortal(
    <>
      <Link href={targetForRole(user.role)} className="header-login" style={{ display: 'inline-flex', height: 42, padding: '0 17px', borderRadius: 12, alignItems: 'center', fontWeight: 900, color: 'var(--primary)', whiteSpace: 'nowrap' }}>
        لوحة التحكم
      </Link>
      <button onClick={logout} className="header-register" style={{ height: 42, padding: '0 20px', border: 0, borderRadius: 999, background: 'var(--primary)', color: '#fff', fontWeight: 900, cursor: 'pointer' }}>
        خروج
      </button>
      <span style={{ fontSize: 12, fontWeight: 900, color: 'var(--ink)', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {user.name}
      </span>
    </>,
    host,
  )
}
