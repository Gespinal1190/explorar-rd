import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const password = await hash('Adaladmin', 12)

    // Original Gmail
    const admin1 = await prisma.user.upsert({
        where: { email: 'adalg.design@gmail.com' },
        update: { role: 'ADMIN', password },
        create: {
            email: 'adalg.design@gmail.com',
            name: 'Adal Admin (Gmail)',
            password,
            role: 'ADMIN',
        },
    })

    // Requested Mail.com (User typo or change)
    const admin2 = await prisma.user.upsert({
        where: { email: 'adalg.design@mail.com' },
        update: { role: 'ADMIN', password },
        create: {
            email: 'adalg.design@mail.com',
            name: 'Adal Admin (Mail)',
            password,
            role: 'ADMIN',
        },
    })

    console.log({ admin1, admin2 })
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
