import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'RepSignal — AI-Powered Reputation Management for Local Businesses',
  description:
    'RepSignal helps local businesses monitor, respond to, and grow their online reviews with AI. Unified dashboard, instant alerts, and AI-generated responses starting at $19/mo.',
  keywords: [
    'reputation management',
    'review management',
    'local business',
    'AI reviews',
    'Google reviews',
    'Yelp reviews',
    'online reputation',
    'small business',
  ],
  authors: [{ name: 'RepSignal' }],
  creator: 'RepSignal',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://repsignal.com',
    siteName: 'RepSignal',
    title: 'RepSignal — AI-Powered Reputation Management for Local Businesses',
    description:
      'Monitor, respond to, and grow your online reviews with AI. Starting at $19/mo.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'RepSignal — AI Reputation Management',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RepSignal — AI Reputation Management',
    description:
      'Monitor, respond to, and grow your online reviews with AI. Starting at $19/mo.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL('https://repsignal.com'),
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="bg-background text-white antialiased">{children}</body>
    </html>
  )
}
