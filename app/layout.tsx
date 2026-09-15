import '../styles/globals.css'
import { ReactNode } from 'react'

export const metadata = {
  title: 'Eng Moaaz Ismail | المنصة التعليمية',
  description: 'منصة Eng Moaaz Ismail التعليمية لطلاب الثانوية العامة — أولى وثانية وثالثة ثانوي.'
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="ar" dir="rtl"><body>{children}</body></html>
}
