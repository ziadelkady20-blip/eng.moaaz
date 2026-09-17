import './globals.css'
import { ReactNode } from 'react'
import WhatsAppContact from '@/components/WhatsAppContact'
import ScrollProgress from '@/components/ScrollProgress'
import MarketingScripts from '@/components/MarketingScripts'
import SiteContentSync from '@/components/SiteContentSync'
import HomeAuthHeader from '@/components/HomeAuthHeader'
import { getSiteSettings } from '@/lib/site-settings'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  const site = await getSiteSettings()
  return { title: site.seoTitle, description: site.seoDescription, metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://eng-moaaz.vercel.app'), robots: { index: true, follow: true }, openGraph: { title: site.seoTitle, description: site.seoDescription, type: 'website' } }
}

const themeScript = `(function(){function getInitial(){try{return localStorage.getItem('eng-moaaz-theme')==='dark'}catch(e){return false}}function applyTheme(dark){document.documentElement.classList.toggle('dark-mode',dark);document.documentElement.setAttribute('data-theme',dark?'dark':'light');try{localStorage.setItem('eng-moaaz-theme',dark?'dark':'light')}catch(e){}}applyTheme(getInitial());document.addEventListener('click',function(e){var t=e.target;if(!(t instanceof Element))return;var x=t.closest('.site-header .theme-toggle');if(!x)return;e.preventDefault();e.stopPropagation();applyTheme(!document.documentElement.classList.contains('dark-mode'))},true)})();`

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="ar" dir="rtl"><head>
    <link rel="stylesheet" href="/hero-animations.css" /><link rel="stylesheet" href="/rabie-force.css?v=2" /><link rel="stylesheet" href="/header-pill.css?v=1" /><link rel="stylesheet" href="/stages-filter.css?v=1" /><link rel="stylesheet" href="/scroll-progress.css?v=1" /><link rel="stylesheet" href="/books-package.css?v=1" /><link rel="stylesheet" href="/dark-mode-header-fix.css?v=3" /><link rel="stylesheet" href="/student-loading.css?v=1" />
    <style>{`@font-face{font-family:'Rabie';src:url('/Rabie-Extralight.ttf?v=2') format('truetype');font-style:normal;font-weight:200 900;font-display:swap}`}</style>
  </head><body style={{fontFamily:"'Rabie', Arial, 'Noto Sans Arabic', sans-serif"}}><HomeAuthHeader/><ScrollProgress/>{children}<MarketingScripts/><SiteContentSync/><WhatsAppContact/><script dangerouslySetInnerHTML={{__html:themeScript}}/></body></html>
}
