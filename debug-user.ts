import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const email = 'adalg.design@mail.com'
    const passwordToCheck = 'password123'

    try {
        console.log(`Checking user: ${email}`)
        const user = await prisma.user.findUnique({
            where: { email },
            include: { agencyProfile: true }
        })

        if (!user) {
            console.log('❌ User NOT found in database.')
        } else {
            console.log('✅ User found:')
            console.log(`   ID: ${user.id}`)
            console.log(`   Email: ${user.email}`)
            console.log(`   Role: ${user.role}`)
            console.log(`   Password Hash Present: ${!!user.password}`)

            if (user.password) {
                const isMatch = await bcrypt.compare(passwordToCheck, user.password)
                console.log(`   Password 'password123' matches? ${isMatch ? '✅ YES' : '❌ NO'}`)
            }
        }
    } catch (e) {
        console.error('Error querying database:', e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
