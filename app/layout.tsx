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

const interactionScript = `(function(){
function init(){
  var revealSelector='.hero-section,.stages-section,.platform-story,.stats-strip,.grade-card,.platform-story-card,.story-point,.feature-card,.course-card,.book-card,.lesson-card,.exam-card,.assignment-card';
  var els=document.querySelectorAll(revealSelector);
  els.forEach(function(el,i){el.classList.add('reveal-on-scroll');el.style.transitionDelay=Math.min((i%6)*70,350)+'ms'});
  if('IntersectionObserver' in window){var io=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('is-visible');io.unobserve(e.target)}})},{threshold:.12,rootMargin:'0px 0px -45px 0px'});els.forEach(function(el){io.observe(el)})}else{els.forEach(function(el){el.classList.add('is-visible')})}
  var glow=document.createElement('div');glow.className='cursor-glow';document.body.appendChild(glow);
  window.addEventListener('pointermove',function(e){glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px'},{passive:true});
  document.addEventListener('pointerdown',function(e){var target=e.target.closest('button,a,[role="button"]');if(!target)return;var r=document.createElement('span');r.className='ui-ripple';r.style.left=e.clientX+'px';r.style.top=e.clientY+'px';document.body.appendChild(r);setTimeout(function(){r.remove()},700)},{passive:true});
  document.querySelectorAll('.grade-card,.course-card,.book-card,.lesson-card,.exam-card,.assignment-card,.feature-card').forEach(function(card){card.addEventListener('pointermove',function(e){var r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transform='perspective(900px) rotateX('+(-y*3)+'deg) rotateY('+(x*3)+'deg) translateY(-6px)'},{passive:true});card.addEventListener('pointerleave',function(){card.style.transform=''})});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();`

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="ar" dir="rtl"><head>
    <link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" /><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&display=swap" />
    <link rel="stylesheet" href="/hero-animations.css" /><link rel="stylesheet" href="/rabie-force.css?v=2" /><link rel="stylesheet" href="/header-pill.css?v=1" /><link rel="stylesheet" href="/stages-filter.css?v=1" /><link rel="stylesheet" href="/scroll-progress.css?v=1" /><link rel="stylesheet" href="/books-package.css?v=1" /><link rel="stylesheet" href="/dark-mode-header-fix.css?v=3" /><link rel="stylesheet" href="/student-loading.css?v=1" /><link rel="stylesheet" href="/brand-logo.css?v=1" /><link rel="stylesheet" href="/interactive-ui.css?v=2" /><link rel="stylesheet" href="/font-override.css?v=3" /><link rel="stylesheet" href="/theme-refresh.css?v=1" /><link rel="stylesheet" href="/platform-identity.css?v=1" />
    <style>{`@font-face{font-family:'MoaazCairo';src:url('https://fonts.gstatic.com/s/cairo/v28/SLXgc1nY6Hkvalr-ao6O59ZMaA.woff2') format('woff2');font-style:normal;font-weight:400;font-display:swap}html,body,button,input,textarea,select{font-family:'Cairo','MoaazCairo',Arial,sans-serif!important}`}</style>
  </head><body style={{fontFamily:"'Cairo', Arial, sans-serif"}}><HomeAuthHeader/><ScrollProgress/>{children}<MarketingScripts/><SiteContentSync/><WhatsAppContact/><script dangerouslySetInnerHTML={{__html:themeScript}}/><script dangerouslySetInnerHTML={{__html:interactionScript}}/></body></html>
}