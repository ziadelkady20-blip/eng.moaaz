import './globals.css'
import { ReactNode } from 'react'

export const metadata = {
  title: 'Eng Moaaz Ismail | المنصة التعليمية',
  description: 'منصة Eng Moaaz Ismail التعليمية لطلاب الثانوية العامة — أولى وثانية وثالثة ثانوي.'
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="stylesheet" href="/hero-animations.css" />
        <style>{`@font-face{font-family:'Rabie';src:url('/Rabie-Extralight.ttf') format('truetype');font-style:normal;font-weight:200;font-display:swap}`}</style>
      </head>
      <body style={{fontFamily:"'Rabie', Arial, 'Noto Sans Arabic', sans-serif"}}>{children}</body>
    </html>
  )
}
