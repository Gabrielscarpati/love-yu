import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'luv.stories',
  description: 'Create unique love countdowns',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
