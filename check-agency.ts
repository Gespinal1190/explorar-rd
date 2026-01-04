
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const email = 'agencia@test.com';
    const user = await prisma.user.findUnique({
        where: { email },
        include: { agencyProfile: true }
    });

    if (!user) {
        console.log(`User ${email} not found`);
    } else {
        console.log(`User found: ${user.name} (${user.role})`);
        if (user.agencyProfile) {
            console.log('Agency Profile found:', user.agencyProfile);
        } else {
            console.log('NO Agency Profile found for this user.');
        }
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
