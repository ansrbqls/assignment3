'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const CATEGORIES = [
    { id: 'engineering', name: '공학/과학' },
    { id: 'humanities', name: '인문' },
    { id: 'social', name: '사회' },
    { id: 'economics', name: '경제' },
    { id: 'arts', name: '예술' },
    { id: 'sports', name: '스포츠' },
    { id: 'etc', name: '기타' }
]

export default function SurveyForm() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        url: '',
        category: ''
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            console.log('Submitting survey form:', formData)

            const response = await fetch('/api/surveys', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })

            const data = await response.json()
            console.log('Survey creation response:', data)

            if (!response.ok) {
                throw new Error(data.error || '설문 등록에 실패했습니다.')
            }

            // 설문 등록 성공 시 메인 페이지로 이동
            alert('설문이 등록되었습니다.')
            router.push('/')
            router.refresh() // 페이지 새로고침
        } catch (err) {
            console.error('Survey creation error:', err)
            setError(err instanceof Error ? err.message : '설문 등록 중 오류가 발생했습니다.')
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="bg-red-50 text-red-500 p-3 rounded">
                    {error}
                </div>
            )}
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    제목
                </label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    설명
                </label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
            </div>
            <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-700">
                    설문 링크
                </label>
                <input
                    type="url"
                    id="url"
                    name="url"
                    value={formData.url}
                    onChange={handleChange}
                    required
                    placeholder="https://..."
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
            </div>
            <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    카테고리
                </label>
                <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                    <option value="">카테고리 선택</option>
                    {CATEGORIES.map(category => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>
            <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
                {loading ? '처리 중...' : '설문 등록'}
            </button>
        </form>
    )
} 