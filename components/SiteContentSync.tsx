'use client'

import { useEffect } from 'react'

type Site = {
  brandName?: string
  siteName?: string
  announcement?: string
  heroBadge?: string
  heroTitle?: string
  heroDescription?: string
  heroPrimaryLabel?: string
  heroPrimaryUrl?: string
  heroSecondaryLabel?: string
  heroSecondaryUrl?: string
  footerText?: string
  supportPhone?: string
  whatsapp?: string
}

function safeUrl(value?: string) {
  const raw = (value || '').trim()
  if (!raw) return '#'
  if (raw.startsWith('/') || raw.startsWith('#')) return raw
  try {
    const url = new URL(raw)
    return url.protocol === 'https:' ? url.toString() : '#'
  } catch {
    return '#'
  }
}

function setText(selector: string, value?: string) {
  if (!value) return
  document.querySelectorAll<HTMLElement>(selector).forEach((node) => { node.textContent = value })
}

function setLink(selector: string, label?: string, href?: string) {
  const nodes = document.querySelectorAll<HTMLAnchorElement>(selector)
  nodes.forEach((node) => {
    if (label) node.textContent = label
    if (href) node.href = safeUrl(href)
  })
}

export default function SiteContentSync() {
  useEffect(() => {
    let cancelled = false
    fetch('/api/site-settings', { cache: 'no-store' })
      .then(async (r) => {
        if (!r.ok) throw new Error('settings fetch failed')
        const data = await r.json()
        if (cancelled) return
        const s: Site = data.site || {}

        setText('.hero-copy .hero-badge', s.heroBadge)
        setText('.hero-copy p', s.heroDescription)
        setText('.hero-copy h1', s.heroTitle)
        setLink('.hero-copy .hero-primary', s.heroPrimaryLabel, s.heroPrimaryUrl)
        setLink('.hero-copy .hero-secondary', s.heroSecondaryLabel, s.heroSecondaryUrl)
        setText('.bottom-cta .cta-copy strong', s.siteName || s.brandName)
        setText('.bottom-cta .cta-copy span', s.heroDescription)
        setLink('.bottom-cta .cta-button', s.heroPrimaryLabel || 'ابدأ الآن', s.heroPrimaryUrl)
        setText('.site-footer > span:first-child', s.footerText)

        const headerBrand = document.querySelector<HTMLImageElement>('.site-header .brand-logo')
        if (headerBrand && s.brandName) headerBrand.alt = s.brandName

        const existing = document.querySelector<HTMLElement>('[data-site-announcement]')
        if (s.announcement) {
          const bar = existing || document.createElement('div')
          bar.dataset.siteAnnouncement = 'true'
          bar.textContent = s.announcement
          bar.style.cssText = 'position:relative;z-index:60;text-align:center;padding:8px 16px;background:#6d2fa3;color:#fff;font-weight:800;font-size:13px;'
          if (!existing) document.querySelector('.site-header')?.before(bar)
        } else if (existing) {
          existing.remove()
        }

        if (s.supportPhone || s.whatsapp) {
          let support = document.querySelector<HTMLDivElement>('[data-site-support]')
          if (!support) {
            support = document.createElement('div')
            support.dataset.siteSupport = 'true'
            support.style.cssText = 'display:flex;justify-content:center;gap:12px;flex-wrap:wrap;margin-top:6px;font-size:12px;font-weight:700;'
            document.querySelector('.site-footer')?.appendChild(support)
          }
          support.replaceChildren()
          if (s.supportPhone) {
            const phone = document.createElement('a')
            phone.href = `tel:${s.supportPhone}`
            phone.textContent = `الدعم: ${s.supportPhone}`
            support.appendChild(phone)
          }
          if (s.whatsapp) {
            const wa = document.createElement('a')
            wa.href = `https://wa.me/${s.whatsapp.replace(/\D/g, '')}`
            wa.target = '_blank'
            wa.rel = 'noreferrer'
            wa.textContent = 'واتساب الدعم'
            support.appendChild(wa)
          }
        }
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [])

  return null
}
