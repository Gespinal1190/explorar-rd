import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const email = 'adalg.design@mail.com'
    const password = 'password123'
    const name = 'Admin User'

    try {
        const hashedPassword = await bcrypt.hash(password, 10)

        console.log(`Creating user: ${email}...`)

        // Check if user exists first (just in case)
        const existing = await prisma.user.findUnique({ where: { email } })
        if (existing) {
            console.log('User already exists, updating password...')
            await prisma.user.update({
                where: { email },
                data: {
                    password: hashedPassword,
                    role: 'ADMIN' // Ensure role is admin
                }
            })
        } else {
            await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name,
                    role: 'ADMIN',
                    emailVerified: new Date(),
                },
            })
        }

        console.log('✅ Admin user created/updated successfully!')

    } catch (e) {
        console.error('Error creating user:', e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
