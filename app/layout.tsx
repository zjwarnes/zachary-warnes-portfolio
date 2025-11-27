import './global.css'
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

const baseUrl = 'https://zacharywarnes.com'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Zachary Warnes | AI Engineer',
    template: '%s | Zachary Warnes',
  },
  description: 'AI & Machine Learning Engineer specializing in LLMs, Computer Vision, and Predictive Analytics.',
  openGraph: {
    title: 'Zachary Warnes | AI Engineer',
    description: 'AI & Machine Learning Engineer specializing in LLMs, Computer Vision, and Predictive Analytics.',
    url: baseUrl,
    siteName: 'Zachary Warnes',
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`dark ${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className="antialiased text-[var(--color-text-primary)] min-h-screen bg-[var(--color-background-dark)]">
        <main className="relative w-full">
          {children}
        </main>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
