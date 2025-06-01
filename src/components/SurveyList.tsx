'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Survey {
    id: number
    title: string
    description: string
    url: string
    category: string
    created_at: string
    response_count: number
    user_name: string
}

interface SurveyListProps {
    category?: string
    sortBy?: 'latest' | 'popular'
}

export default function SurveyList({ category = '', sortBy = 'latest' }: SurveyListProps) {
    const [surveys, setSurveys] = useState<Survey[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const router = useRouter()

    useEffect(() => {
        fetchSurveys()
    }, [category, sortBy])

    const fetchSurveys = async () => {
        try {
            setLoading(true)
            const queryParams = new URLSearchParams()
            if (category) queryParams.append('category', category)
            if (sortBy) queryParams.append('sort', sortBy)

            const response = await fetch(`/api/surveys?${queryParams.toString()}`)
            if (!response.ok) throw new Error('Failed to fetch surveys')

            const data = await response.json()
            setSurveys(data)
            setError('')
        } catch (err) {
            console.error('Error fetching surveys:', err)
            setError('설문 목록을 불러오는데 실패했습니다.')
        } finally {
            setLoading(false)
        }
    }

    const handleSurveyClick = async (surveyId: number, surveyUrl: string) => {
        console.log(`[Client] handleSurveyClick - Survey ID: ${surveyId}, URL: ${surveyUrl}`);
        try {
            // 응답자 수 증가 API 호출
            const apiUrl = `/api/surveys/${surveyId}/respond`;
            console.log(`[Client] handleSurveyClick - Calling API: POST ${apiUrl}`);
            const response = await fetch(apiUrl, {
                method: 'POST',
                credentials: 'include', // 쿠키를 포함하여 요청
            })

            if (!response.ok) {
                const data = await response.json()
                if (response.status === 401) {
                    alert('로그인이 필요한 서비스입니다.')
                    router.push('/login')
                    return
                }
                throw new Error(data.error || '설문 응답 중 오류가 발생했습니다.')
            }

            // 설문 목록 새로고침
            await fetchSurveys()

            // 새 탭에서 설문 링크 열기
            window.open(surveyUrl, '_blank')
        } catch (err) {
            console.error('Error responding to survey:', err)
            alert(err instanceof Error ? err.message : '설문 응답 중 오류가 발생했습니다.')
        }
    }

    if (loading) {
        return <div className="text-center py-8">로딩 중...</div>
    }

    if (error) {
        return <div className="text-center py-8 text-red-500">{error}</div>
    }

    if (surveys.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                {category ? '해당 카테고리의 설문이 없습니다.' : '등록된 설문이 없습니다.'}
            </div>
        )
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {surveys.map((survey) => (
                <div
                    key={survey.id}
                    className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                    <div className="p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {survey.title}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">
                            {survey.description}
                        </p>
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                            <span>작성자: {survey.user_name}</span>
                            <span>응답: {survey.response_count}개</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                {survey.category}
                            </span>
                            <button
                                onClick={() => handleSurveyClick(survey.id, survey.url)}
                                className="text-blue-500 hover:text-blue-600 font-medium"
                            >
                                설문 참여하기 →
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
} 