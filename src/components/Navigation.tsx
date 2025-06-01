'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function Navigation() {
    const pathname = usePathname()
    const router = useRouter()
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        checkLoginStatus()
    }, [])

    const checkLoginStatus = async () => {
        try {
            const response = await fetch('/api/user')
            setIsLoggedIn(response.ok)
        } catch (error) {
            console.error('Login status check error:', error)
            setIsLoggedIn(false)
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = () => {
        // 쿠키에서 토큰 삭제
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
        setIsLoggedIn(false)
        router.push('/')
    }

    if (loading) {
        return (
            <nav className="bg-white shadow-sm">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center h-16">
                        <Link href="/" className="text-xl font-bold text-primary">
                            Open Survey
                        </Link>
                    </div>
                </div>
            </nav>
        )
    }

    return (
        <nav className="bg-white shadow-sm">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <Link href="/" className="text-xl font-bold text-primary">
                        Open Survey
                    </Link>

                    <div className="flex items-center space-x-4">
                        {isLoggedIn ? (
                            <>
                                <Link
                                    href="/user"
                                    className={`text-gray-600 hover:text-primary ${pathname === '/user' ? 'text-primary' : ''
                                        }`}
                                >
                                    마이페이지
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                                >
                                    로그아웃
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className={`text-gray-600 hover:text-primary ${pathname === '/login' ? 'text-primary' : ''
                                        }`}
                                >
                                    로그인
                                </Link>
                                <Link
                                    href="/signup"
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    회원가입
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
} 