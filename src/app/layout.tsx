import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Open Survey - 설문 공유 플랫폼',
    description: '다양한 설문을 공유하고 응답할 수 있는 플랫폼',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="ko">
            <body className={inter.className}>
                <Navigation />
                <main className="min-h-screen bg-gray-50">
                    {children}
                </main>
            </body>
        </html>
    )
} 