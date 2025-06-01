console.log('[API] surveys/[id]/route.ts file loaded');

import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { db } from '@/lib/db'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Get user ID from token
async function getUserId() {
    const token = cookies().get('token')?.value
    if (!token) return null

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: number }
        return decoded.id
    } catch {
        return null
    }
}

// GET /api/surveys/[id]
export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const survey = db.prepare(`
            SELECT s.*, u.name as user_name
            FROM surveys s
            JOIN users u ON s.user_id = u.id
            WHERE s.id = ?
        `).get(params.id)

        if (!survey) {
            return NextResponse.json(
                { error: '설문을 찾을 수 없습니다.' },
                { status: 404 }
            )
        }

        return NextResponse.json(survey)
    } catch (error) {
        console.error('Get survey error:', error)
        return NextResponse.json(
            { error: '설문을 불러오는 중 오류가 발생했습니다.' },
            { status: 500 }
        )
    }
}

// DELETE /api/surveys/[id]
export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const userId = await getUserId()
        if (!userId) {
            return NextResponse.json(
                { error: '로그인이 필요합니다.' },
                { status: 401 }
            )
        }

        // Check if survey exists and belongs to the user
        const survey = db.prepare(`
            SELECT * FROM surveys
            WHERE id = ? AND user_id = ?
        `).get(params.id, userId)

        if (!survey) {
            return NextResponse.json(
                { error: '설문을 찾을 수 없거나 삭제 권한이 없습니다.' },
                { status: 404 }
            )
        }

        // Delete survey responses first (due to foreign key constraint)
        db.prepare(`
            DELETE FROM survey_responses
            WHERE survey_id = ?
        `).run(params.id)

        // Delete the survey
        db.prepare(`
            DELETE FROM surveys
            WHERE id = ?
        `).run(params.id)

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Delete survey error:', error)
        return NextResponse.json(
            { error: '설문 삭제 중 오류가 발생했습니다.' },
            { status: 500 }
        )
    }
} 