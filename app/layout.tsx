import './globals.css'
import { ReactNode } from 'react'
import WhatsAppContact from '@/components/WhatsAppContact'
import ScrollProgress from '@/components/ScrollProgress'

export const metadata = {
  title: 'Eng Moaaz Ismail | المنصة التعليمية',
  description: 'منصة Eng Moaaz Ismail التعليمية لطلاب الثانوية العامة — أولى وثانية ثانوي.'
}

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
        <style>{`@font-face{font-family:'Rabie';src:url('/Rabie-Extralight.ttf?v=2') format('truetype');font-style:normal;font-weight:200 900;font-display:swap}`}</style>
      </head>
      <body style={{fontFamily:"'Rabie', Arial, 'Noto Sans Arabic', sans-serif"}}><ScrollProgress />{children}<WhatsAppContact /></body>
    </html>
  )
}
