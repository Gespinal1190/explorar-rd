'use server'

import { createSession, deleteSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'

export async function loginAction(uid: string, email: string) {
    // 1. Check if user exists in DB
    let user = await prisma.user.findUnique({
        where: { email }
    })

    if (!user) {
        // If user doesn't exist (e.g. first Google login), create them
        user = await prisma.user.create({
            data: {
                email,
                name: email.split('@')[0],
                role: 'USER',
                password: 'GOOGLE_AUTH_USER',
            }
        })
    }

    // 2. Create Session
    await createSession(user.id, user.role, user.email)

    // 3. Redirect
    redirect('/dashboard')
}

export async function registerAction(uid: string, email: string, name: string, role: string, agencyData?: any) {
    // Check collision
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
        return { error: 'El usuario ya existe' }
    }

    const user = await prisma.user.create({
        data: {
            email,
            name,
            role,
            password: 'FIREBASE_AUTH_USER',
        }
    })

    if (role === 'AGENCY') {
        await prisma.agencyProfile.create({
            data: {
                userId: user.id,
                name: name,
                isVerified: false,
                description: agencyData?.description || 'Agencia nueva',
                phone: agencyData?.phone,
                // walletAddress removed as it defaults to null or isn't in main CreateInput
                licenseUrl: agencyData?.licenseUrl,
                premisesUrl: agencyData?.premisesUrl,
                website: agencyData?.website,
                rnc: agencyData?.rnc,
                logo: agencyData?.logo,
                // other defaults
            }
        })
    }

    await createSession(user.id, user.role, user.email)
    redirect('/dashboard')
}

export async function logoutAction() {
    await deleteSession()
    redirect('/')
}

export async function syncUserRole(email: string) {
    const user = await prisma.user.findUnique({
        where: { email },
        select: { role: true }
    })
    return user?.role || 'USER'
}
