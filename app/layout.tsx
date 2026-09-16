import './globals.css'
import { ReactNode } from 'react'
import WhatsAppContact from '@/components/WhatsAppContact'
import ScrollProgress from '@/components/ScrollProgress'

export const metadata = {
  title: 'Eng Moaaz Ismail | المنصة التعليمية',
  description: 'منصة Eng Moaaz Ismail التعليمية لطلاب الثانوية العامة — أولى وثانية ثانوي.'
}

const themeScript = `
(function(){
  function setupThemeToggle(){
    var slot=document.querySelector('.site-header .theme-toggle');
    if(!slot || slot.dataset.themeReady==='1') return !!slot;
    slot.dataset.themeReady='1';
    slot.removeAttribute('aria-hidden');
    slot.setAttribute('role','button');
    slot.setAttribute('tabindex','0');
    slot.style.pointerEvents='auto';
    var moon='<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20.5 15.3A8.5 8.5 0 1 1 8.7 3.5 8.5 8.5 0 0 0 20.5 15.3Z"/></svg>';
    var sun='<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>';
    function apply(dark){
      document.documentElement.classList.toggle('dark-mode',dark);
      try{localStorage.setItem('eng-moaaz-theme',dark?'dark':'light')}catch(e){}
      slot.innerHTML=dark?sun:moon;
      slot.setAttribute('aria-label',dark?'تفعيل الوضع النهاري':'تفعيل الوضع الليلي');
      slot.setAttribute('title',dark?'الوضع النهاري':'الوضع الليلي');
    }
    var initial=false;
    try{initial=localStorage.getItem('eng-moaaz-theme')==='dark'}catch(e){}
    apply(initial);
    slot.addEventListener('click',function(){
      apply(!document.documentElement.classList.contains('dark-mode'));
    });
    slot.addEventListener('keydown',function(e){
      if(e.key==='Enter'||e.key===' '){e.preventDefault();slot.click();}
    });
    return true;
  }
  if(!setupThemeToggle()){
    var observer=new MutationObserver(function(){if(setupThemeToggle()) observer.disconnect()});
    if(document.body) observer.observe(document.body,{childList:true,subtree:true});
    else document.addEventListener('DOMContentLoaded',function(){if(!setupThemeToggle()) observer.observe(document.body,{childList:true,subtree:true})},{once:true});
  }
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
        <link rel="stylesheet" href="/dark-mode-header-fix.css?v=2" />
        <style>{`@font-face{font-family:'Rabie';src:url('/Rabie-Extralight.ttf?v=2') format('truetype');font-style:normal;font-weight:200 900;font-display:swap}`}</style>
      </head>
      <body style={{fontFamily:"'Rabie', Arial, 'Noto Sans Arabic', sans-serif"}}><ScrollProgress />{children}<WhatsAppContact /><script dangerouslySetInnerHTML={{__html:themeScript}} /></body>
    </html>
  )
}
