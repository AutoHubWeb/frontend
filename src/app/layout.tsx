import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AppProviders } from '@/app/providers'
import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AutoHubWeb',
  description: 'AutoHubWeb - Your tool platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  )
}
