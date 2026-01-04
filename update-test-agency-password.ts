import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const newPassword = await hash('123456', 12)

    const user = await prisma.user.update({
        where: { email: 'agencia@test.com' },
        data: {
            password: newPassword
        }
    })

    console.log('Password updated for user:', user.email)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
