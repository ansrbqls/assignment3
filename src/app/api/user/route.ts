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

// GET /api/user
export async function GET() {
    try {
        const userId = await getUserId()
        if (!userId) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            )
        }

        const user = db.prepare('SELECT id, name, email FROM users WHERE id = ?').get(userId)
        console.log('User data:', user)

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            )
        }

        // Get user's surveys
        const surveys = db.prepare(`
            SELECT * FROM surveys
            WHERE user_id = ?
            ORDER BY created_at DESC
        `).all(userId)

        // Get user's responses
        const responses = db.prepare(`
            SELECT s.*, sr.created_at as responded_at
            FROM surveys s
            JOIN survey_responses sr ON s.id = sr.survey_id
            WHERE sr.user_id = ?
            ORDER BY sr.created_at DESC
        `).all(userId)

        return NextResponse.json({
            user,
            surveys,
            responses,
        })
    } catch (error) {
        console.error('Get user data error:', error)
        return NextResponse.json(
            { error: 'Failed to get user data' },
            { status: 500 }
        )
    }
} 