'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Survey {
    id: number
    title: string
    description: string
    url: string
    category: string
    created_at: string
    response_count: number
}

interface UserData {
    user: {
        id: number
        name: string
        email: string
    }
    surveys: Survey[]
    responses: Survey[]
}

export default function MyPage() {
    const [userData, setUserData] = useState<UserData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const router = useRouter()

    useEffect(() => {
        fetchUserData()
    }, [])

    const fetchUserData = async () => {
        try {
            const response = await fetch('/api/user')
            if (!response.ok) {
                if (response.status === 401) {
                    router.push('/login')
                    return
                }
                throw new Error('Failed to fetch user data')
            }
            const data = await response.json()
            setUserData(data)
        } catch (err) {
            console.error('Error fetching user data:', err)
            setError('사용자 정보를 불러오는데 실패했습니다.')
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteSurvey = async (surveyId: number) => {
        if (!confirm('정말로 이 설문을 삭제하시겠습니까?')) {
            return
        }

        try {
            const response = await fetch(`/api/surveys/${surveyId}`, {
                method: 'DELETE',
            })

            if (!response.ok) {
                throw new Error('Failed to delete survey')
            }

            setUserData(prev => {
                if (!prev) return null
                return {
                    ...prev,
                    surveys: prev.surveys.filter(survey => survey.id !== surveyId)
                }
            })

            alert('설문이 삭제되었습니다.')
        } catch (err) {
            console.error('Error deleting survey:', err)
            alert('설문 삭제 중 오류가 발생했습니다.')
        }
    }

    const handleSurveyClick = async (surveyId: number, surveyUrl: string) => {
        try {
            // 응답자 수 증가 API 호출
            await fetch(`/api/surveys/${surveyId}/respond`, {
                method: 'POST',
            })

            // 사용자 데이터 새로고침
            fetchUserData()

            // 새 탭에서 설문 링크 열기
            window.open(surveyUrl, '_blank')
        } catch (err) {
            console.error('Error responding to survey:', err)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="bg-red-50 text-red-500 p-4 rounded-lg shadow-sm">
                    {error}
                </div>
            </div>
        )
    }

    if (!userData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="bg-gray-50 text-gray-500 p-4 rounded-lg shadow-sm">
                    사용자 정보를 찾을 수 없습니다.
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">마이페이지</h1>

                    {/* User Info Card */}
                    <div className="bg-white rounded-xl shadow-sm p-8 mb-8 border border-gray-100">
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-2xl text-blue-600">
                                    {userData.user.name.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div>
                                <h2 className="text-2xl font-semibold text-gray-900">{userData.user.name}</h2>
                                <p className="text-gray-500">{userData.user.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* My Surveys Section */}
                    <div className="bg-white rounded-xl shadow-sm p-8 mb-8 border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-semibold text-gray-900">내가 등록한 설문</h2>
                            <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">
                                {userData.surveys.length}개
                            </span>
                        </div>
                        {userData.surveys.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-gray-400 mb-2">📝</div>
                                <p className="text-gray-500">등록한 설문이 없습니다.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {userData.surveys.map((survey) => (
                                    <div
                                        key={survey.id}
                                        className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <h3 className="text-xl font-medium text-gray-900 mb-2">
                                                    {survey.title}
                                                </h3>
                                                <p className="text-gray-600 mb-4 line-clamp-2">
                                                    {survey.description}
                                                </p>
                                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                    <span className="flex items-center">
                                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                                                        </svg>
                                                        {survey.response_count}개의 응답
                                                    </span>
                                                    <span className="flex items-center">
                                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                                        </svg>
                                                        {survey.category}
                                                    </span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteSurvey(survey.id)}
                                                className="ml-4 p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="설문 삭제"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => handleSurveyClick(survey.id, survey.url)}
                                            className="inline-flex items-center mt-4 text-blue-600 hover:text-blue-700 font-medium"
                                        >
                                            설문 링크로 이동
                                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* My Responses Section */}
                    <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-semibold text-gray-900">내가 응답한 설문</h2>
                            <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm">
                                {userData.responses.length}개
                            </span>
                        </div>
                        {userData.responses.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-gray-400 mb-2">✍️</div>
                                <p className="text-gray-500">응답한 설문이 없습니다.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {userData.responses.map((survey) => (
                                    <div
                                        key={survey.id}
                                        className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors"
                                    >
                                        <h3 className="text-xl font-medium text-gray-900 mb-2">
                                            {survey.title}
                                        </h3>
                                        <p className="text-gray-600 mb-4 line-clamp-2">
                                            {survey.description}
                                        </p>
                                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                                            <span className="flex items-center">
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                                                </svg>
                                                {survey.response_count}개의 응답
                                            </span>
                                            <span className="flex items-center">
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                                </svg>
                                                {survey.category}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => handleSurveyClick(survey.id, survey.url)}
                                            className="inline-flex items-center mt-4 text-blue-600 hover:text-blue-700 font-medium"
                                        >
                                            설문 링크로 이동
                                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
} 