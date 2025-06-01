'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import SurveyList from '@/components/SurveyList'
import SurveyForm from '@/components/SurveyForm'

const CATEGORIES = [
    { id: 'engineering', name: '공학/과학' },
    { id: 'humanities', name: '인문' },
    { id: 'social', name: '사회' },
    { id: 'economics', name: '경제' },
    { id: 'arts', name: '예술' },
    { id: 'sports', name: '스포츠' },
    { id: 'etc', name: '기타' }
]

export default function Home() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [loading, setLoading] = useState(true)
    const [selectedCategory, setSelectedCategory] = useState('')
    const [sortBy, setSortBy] = useState<'latest' | 'popular'>('latest')

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

    if (loading) {
        return <div className="text-center py-8">로딩 중...</div>
    }

    return (
        <main className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold text-gray-900">Open Survey</h1>
                        <div className="space-x-4">
                            {isLoggedIn ? (
                                <>
                                    <Link
                                        href="/user"
                                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                                    >
                                        내 활동
                                    </Link>
                                    <button
                                        onClick={() => {
                                            document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
                                            setIsLoggedIn(false)
                                        }}
                                        className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                                    >
                                        로그아웃
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                                    >
                                        로그인
                                    </Link>
                                    <Link
                                        href="/signup"
                                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                                    >
                                        회원가입
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                {/* Survey Form */}
                {isLoggedIn && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">새 설문 등록</h2>
                        <SurveyForm />
                    </div>
                )}

                {/* Survey List */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold text-gray-900">설문 목록</h2>
                        <div className="flex space-x-4">
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setSortBy('latest')}
                                    className={`px-4 py-2 rounded-lg transition-colors ${sortBy === 'latest'
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    최신순
                                </button>
                                <button
                                    onClick={() => setSortBy('popular')}
                                    className={`px-4 py-2 rounded-lg transition-colors ${sortBy === 'popular'
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    인기순
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {CATEGORIES.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(
                                    selectedCategory === category.id ? '' : category.id
                                )}
                                className={`px-4 py-2 rounded-full transition-colors ${selectedCategory === category.id
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>

                    <SurveyList category={selectedCategory} sortBy={sortBy} />
                </div>
            </div>
        </main>
    )
} 