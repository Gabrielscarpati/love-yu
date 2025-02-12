import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Love Yu',
  description: 'Create a beautiful countdown timer for your special day.',
  generator: 'Next.js',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
