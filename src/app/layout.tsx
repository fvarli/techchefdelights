import type { Metadata } from 'next'
import '@fontsource/instrument-serif'
import '@fontsource-variable/geist'
import '@fontsource-variable/jetbrains-mono'
import './globals.css'

export const metadata: Metadata = {
  title: 'TechChefDelights',
  description: 'Where tech meets taste — recipes in three languages.',
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
