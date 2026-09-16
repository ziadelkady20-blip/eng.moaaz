import './globals.css'
import { ReactNode } from 'react'
import WhatsAppContact from '@/components/WhatsAppContact'
import ScrollProgress from '@/components/ScrollProgress'
import MarketingScripts from '@/components/MarketingScripts'
import SiteContentSync from '@/components/SiteContentSync'
import { getSiteSettings } from '@/lib/site-settings'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  const site = await getSiteSettings()
  return {
    title: site.seoTitle,
    description: site.seoDescription,
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://eng-moaaz.vercel.app'),
    robots: { index: true, follow: true },
    openGraph: { title: site.seoTitle, description: site.seoDescription, type: 'website' },
  }
}

const themeScript = `
(function(){
  function getInitial(){
    try{return localStorage.getItem('eng-moaaz-theme')==='dark'}catch(e){return false}
  }
  function applyTheme(dark){
    document.documentElement.classList.toggle('dark-mode', dark)
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
    try{localStorage.setItem('eng-moaaz-theme', dark ? 'dark' : 'light')}catch(e){}
  }

  applyTheme(getInitial())

  function onThemeClick(event){
    var target=event.target
    if(!(target instanceof Element)) return
    var toggle=target.closest('.site-header .theme-toggle')
    if(!toggle) return
    event.preventDefault()
    event.stopPropagation()
    applyTheme(!document.documentElement.classList.contains('dark-mode'))
  }

  function onThemeKeydown(event){
    if(event.key!=='Enter' && event.key!==' ') return
    var target=event.target
    if(!(target instanceof Element)) return
    var toggle=target.closest('.site-header .theme-toggle')
    if(!toggle) return
    event.preventDefault()
    event.stopPropagation()
    applyTheme(!document.documentElement.classList.contains('dark-mode'))
  }

  document.addEventListener('click', onThemeClick, true)
  document.addEventListener('keydown', onThemeKeydown, true)
})();
`

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="stylesheet" href="/hero-animations.css" />
        <link rel="stylesheet" href="/rabie-force.css?v=2" />
        <link rel="stylesheet" href="/header-pill.css?v=1" />
        <link rel="stylesheet" href="/stages-filter.css?v=1" />
        <link rel="stylesheet" href="/scroll-progress.css?v=1" />
        <link rel="stylesheet" href="/books-package.css?v=1" />
        <link rel="stylesheet" href="/dark-mode-header-fix.css?v=3" />
        <style>{`@font-face{font-family:'Rabie';src:url('/Rabie-Extralight.ttf?v=2') format('truetype');font-style:normal;font-weight:200 900;font-display:swap}`}</style>
      </head>
      <body style={{fontFamily:"'Rabie', Arial, 'Noto Sans Arabic', sans-serif"}}><ScrollProgress />{children}<MarketingScripts /><SiteContentSync /><WhatsAppContact /><script dangerouslySetInnerHTML={{__html:themeScript}} /></body>
    </html>
  )
}
