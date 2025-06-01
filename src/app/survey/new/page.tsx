'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const categories = [
    { id: 'engineering', name: '공학/과학' },
    { id: 'humanities', name: '인문' },
    { id: 'social', name: '사회' },
    { id: 'economics', name: '경제' },
    { id: 'arts', name: '예술' },
    { id: 'sports', name: '스포츠' },
    { id: 'etc', name: '기타' },
]

export default function NewSurvey() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        url: '',
        category: '',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        // TODO: Implement survey submission
        console.log('Form submitted:', formData)
        router.push('/')
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">새 설문 등록</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                            설문 제목
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="input-field"
                            placeholder="설문 제목을 입력하세요"
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            설문 설명
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            className="input-field"
                            placeholder="설문에 대한 설명을 입력하세요"
                        />
                    </div>

                    <div>
                        <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
                            설문 링크
                        </label>
                        <input
                            type="url"
                            id="url"
                            name="url"
                            value={formData.url}
                            onChange={handleChange}
                            required
                            className="input-field"
                            placeholder="https://..."
                        />
                    </div>

                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                            카테고리
                        </label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            className="input-field"
                        >
                            <option value="">카테고리 선택</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="btn-secondary"
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            className="btn-primary"
                        >
                            등록하기
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
} 