import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { db } from '@/lib/db'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Get user ID from token
async function getUserId() {
    const token = cookies().get('token')?.value
    if (!token) {
        console.log('No token found in cookies')
        return null
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: number }
        console.log('Decoded token:', decoded)
        return decoded.userId
    } catch (error) {
        console.error('Token verification error:', error)
        return null
    }
}

// GET /api/surveys
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const category = searchParams.get('category')
        const sort = searchParams.get('sort') || 'latest'

        let query = `
            SELECT 
                s.*,
                u.name as user_name,
                (SELECT COUNT(*) FROM survey_responses WHERE survey_id = s.id) as response_count
            FROM surveys s
            LEFT JOIN users u ON s.user_id = u.id
        `

        const params: any[] = []

        if (category) {
            query += ' WHERE s.category = ?'
            params.push(category)
        }

        if (sort === 'popular') {
            query += ' ORDER BY response_count DESC, s.created_at DESC'
        } else {
            query += ' ORDER BY s.created_at DESC'
        }

        console.log('Executing query:', query, 'with params:', params)
        const surveys = db.prepare(query).all(...params)
        console.log('Query result:', surveys)

        return NextResponse.json(surveys)
    } catch (error) {
        console.error('Error fetching surveys:', error)
        return NextResponse.json(
            { error: 'Failed to fetch surveys' },
            { status: 500 }
        )
    }
}

// POST /api/surveys
export async function POST(request: NextRequest) {
    try {
        const token = cookies().get('token')?.value

        if (!token) {
            console.log('No token found in cookies')
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            )
        }

        const decoded = jwt.verify(token, JWT_SECRET) as { id: number }
        console.log('Decoded token:', decoded)

        const body = await request.json()
        console.log('Request body:', body)

        const { title, description, url, category } = body

        // Validate required fields
        if (!title || !url || !category) {
            return NextResponse.json(
                { error: 'Title, URL, and category are required' },
                { status: 400 }
            )
        }

        // Validate URL format
        try {
            new URL(url)
        } catch {
            return NextResponse.json(
                { error: 'Invalid URL format' },
                { status: 400 }
            )
        }

        // Check if user exists
        const user = db.prepare('SELECT * FROM users WHERE id = ?').get(decoded.id)
        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            )
        }

        // Insert survey
        const result = db.prepare(`
            INSERT INTO surveys (title, description, url, category, user_id)
            VALUES (?, ?, ?, ?, ?)
        `).run(title, description, url, category, decoded.id)

        console.log('Survey insertion result:', result)

        // Verify the inserted survey
        const insertedSurvey = db.prepare(`
            SELECT 
                s.*,
                u.name as user_name,
                0 as response_count
            FROM surveys s
            LEFT JOIN users u ON s.user_id = u.id
            WHERE s.id = ?
        `).get(result.lastInsertRowid)

        console.log('Inserted survey:', insertedSurvey)

        return NextResponse.json(insertedSurvey, { status: 201 })
    } catch (error) {
        console.error('Error creating survey:', error)
        return NextResponse.json(
            { error: 'Failed to create survey' },
            { status: 500 }
        )
    }
} 