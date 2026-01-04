
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const password = await hash('123456', 12)

    // Update agency user
    try {
        const agency = await prisma.user.update({
            where: { email: 'agencia@test.com' },
            data: { password }
        });
        console.log('Password updated for agencia@test.com');
    } catch (e) {
        console.log('User agencia@test.com not found or error:', e);
    }
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
