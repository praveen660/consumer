import type { Metadata } from 'next'
import Link from 'next/link'
import NavAuth from '@/components/NavAuth'
import './globals.css'

export const metadata: Metadata = {
  title: 'Ease of Living',
  description: 'API Gateway Consumer Test Application',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
            {/* Brand */}
            <Link href="/" className="text-lg font-bold text-gray-900 shrink-0">
              Consumer Application
            </Link>

            {/* Center nav */}
            <nav className="flex items-center gap-1">
              <Link href="/" className="px-4 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
                Home
              </Link>
              <Link href="/services" className="px-4 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
                Services
              </Link>
            </nav>

            {/* Right — profile icon or login */}
            <NavAuth />
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-8">
          {children}
        </main>
      </body>
    </html>
  )
}
