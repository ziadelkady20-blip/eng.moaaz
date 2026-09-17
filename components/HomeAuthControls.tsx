'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function HomeAuthControls() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<{ name: string; role: string } | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (pathname !== '/') return
    let active = true
    fetch('/api/auth/me', { cache: 'no-store' })
      .then(async response => {
        if (!response.ok) return null
        return response.json()
      })
      .then(data => {
        if (active) setUser(data?.user ?? null)
      })
      .catch(() => {
        if (active) setUser(null)
      })
    return () => {
      active = false
    }
  }, [pathname])

  useEffect(() => {
    if (!mounted || pathname !== '/') return
    const actions = document.querySelector<HTMLElement>('.site-header .header-actions')
    if (!actions) return
    const login = actions.querySelector<HTMLElement>('.header-login')
    const register = actions.querySelector<HTMLElement>('.header-register')
    const oldInjected = actions.querySelector('[data-auth-controls]')
    oldInjected?.remove()
    if (login) login.style.display = user ? 'none' : ''
    if (register) register.style.display = user ? 'none' : ''
    if (!user) return

    const holder = document.createElement('div')
    holder.dataset.authControls = 'true'
    holder.style.display = 'flex'
    holder.style.alignItems = 'center'
    holder.style.gap = '8px'
    holder.style.direction = 'rtl'
    actions.appendChild(holder)
    ;(holder as HTMLElement & { _cleanup?: () => void })._cleanup = () => holder.remove()

    return () => {
      holder.remove()
      if (login) login.style.display = ''
      if (register) register.style.display = ''
    }
  }, [mounted, pathname, user])

  if (!mounted || pathname !== '/' || !user) return null

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    router.refresh()
  }

  return (
    <div className="sr-only" aria-hidden="true">
      <Link href={user.role === 'ADMIN' ? '/admin' : user.role === 'TEACHER' ? '/teacher' : user.role === 'PARENT' ? '/parent' : user.role === 'SUPPORT' ? '/support' : '/student'}>حسابي</Link>
      <button onClick={logout}>خروج</button>
    </div>
  )
}
