import type { Metadata, Viewport } from 'next'
import { Kode_Mono } from 'next/font/google'
import './globals.css'
import { SmoothScrolling } from '@/app/components/layout'

const kodeMono = Kode_Mono({
  variable: '--font-kode-mono',
  subsets: ['latin'],
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0B0B0B',
}

export const metadata: Metadata = {
  title: 'Raflux',
  description: 'Decentralized Raffle Platform on Base',
  metadataBase: new URL('https://raflux.io'),
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${kodeMono.variable} antialiased overflow-x-hidden`}>
        <SmoothScrolling />
        {children}
      </body>
    </html>
  )
}
