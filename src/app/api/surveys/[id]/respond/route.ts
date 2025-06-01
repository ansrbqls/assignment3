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

// POST /api/surveys/[id]/respond
export async function POST(
    req: Request,
    { params }: { params: { id: string } }
) {
    console.log(`[API] POST /api/surveys/${params.id}/respond - Start`); // Log start
    try {
        console.log('[API] POST - Calling getUserId'); // Log before getUserId
        const userId = await getUserId()
        console.log(`[API] POST - getUserId returned: ${userId}`); // Log after getUserId

        if (!userId) {
            return NextResponse.json(
                { error: '로그인이 필요합니다.' },
                { status: 401 }
            )
        }

        // Check if user has already responded
        const existingResponse = db.prepare(`
            SELECT * FROM survey_responses
            WHERE survey_id = ? AND user_id = ?
        `).get(params.id, userId)

        if (existingResponse) {
            return NextResponse.json(
                { error: '이미 응답한 설문입니다.' },
                { status: 400 }
            )
        }

        // Add response
        db.prepare(`
            INSERT INTO survey_responses (survey_id, user_id)
            VALUES (?, ?)
        `).run(params.id, userId)

        // Update response count
        db.prepare(`
            UPDATE surveys
            SET response_count = response_count + 1
            WHERE id = ?
        `).run(params.id)

        console.log('[API] POST - Success'); // Log success
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Respond to survey error:', error)
        console.error('Error stack:', (error as any).stack); // Log stack trace
        return NextResponse.json(
            { error: '설문 응답 중 오류가 발생했습니다.' },
            { status: 500 }
        )
    }
} 