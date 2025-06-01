import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'

export async function POST(req: Request) {
    try {
        const body = await req.json()
        console.log('Signup request body:', body)

        const { name, email, password } = body

        // Validate required fields
        if (!name || !email || !password) {
            console.log('Missing required fields:', { name, email, password: !!password })
            return NextResponse.json(
                { error: '이름, 이메일, 비밀번호는 필수 입력 항목입니다.' },
                { status: 400 }
            )
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            console.log('Invalid email format:', email)
            return NextResponse.json(
                { error: '올바른 이메일 형식이 아닙니다.' },
                { status: 400 }
            )
        }

        // Validate password length
        if (password.length < 6) {
            console.log('Password too short')
            return NextResponse.json(
                { error: '비밀번호가 너무 짧습니다!' },
                { status: 400 }
            )
        }

        // Check if user already exists
        const existingUser = db.prepare('SELECT * FROM users WHERE email = ?').get(email)
        console.log('Existing user check:', existingUser)

        if (existingUser) {
            return NextResponse.json(
                { error: '이미 등록된 이메일입니다.' },
                { status: 400 }
            )
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)
        console.log('Password hashed successfully')

        // Create user
        const result = db.prepare(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)'
        ).run(name, email, hashedPassword)
        console.log('User creation result:', result)

        return NextResponse.json(
            { message: '회원가입이 완료되었습니다.' },
            { status: 201 }
        )
    } catch (error) {
        console.error('Signup error details:', error)
        return NextResponse.json(
            { error: '회원가입 중 오류가 발생했습니다.' },
            { status: 500 }
        )
    }
} 