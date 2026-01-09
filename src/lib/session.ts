import 'server-only'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const key = new TextEncoder().encode(process.env.AUTH_SECRET)

const cookieName = 'descubrerd_session'

export async function encrypt(payload: any) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(key)
}

export async function decrypt(session: string | undefined = '') {
    try {
        const { payload } = await jwtVerify(session, key, {
            algorithms: ['HS256'],
        })
        return payload
    } catch (error) {
        return null
    }
}

export async function createSession(userId: string, role: string, email: string) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    const session = await encrypt({ userId, role, email, expiresAt })
    const cookieStore = await cookies()

    cookieStore.set(cookieName, session, {
        httpOnly: true,
        secure: true,
        expires: expiresAt,
        sameSite: 'lax',
        path: '/',
    })
}

export async function verifySession() {
    const cookieStore = await cookies()
    const cookie = cookieStore.get(cookieName)?.value
    const session = await decrypt(cookie)

    if (!session?.userId) {
        redirect('/login')
    }

    return { isAuth: true, userId: String(session.userId), role: String(session.role), email: String(session.email) }
}

export async function getSession() {
    const cookieStore = await cookies()
    const cookie = cookieStore.get(cookieName)?.value
    const session = await decrypt(cookie)
    return session
}

export async function deleteSession() {
    const cookieStore = await cookies()
    cookieStore.delete(cookieName)
}
