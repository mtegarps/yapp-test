import type { Metadata } from 'next'
import { Kode_Mono } from 'next/font/google'
import './globals.css'
import { SmoothScrolling } from '@/app/components/layout'

const kodeMono = Kode_Mono({
  variable: '--font-kode-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Raflux',
  description: 'Decentralized Raffle Platform on Base',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${kodeMono.variable} antialiased overflow-x-hidden`}>
        <SmoothScrolling />
        {children}
      </body>
    </html>
  )
}
