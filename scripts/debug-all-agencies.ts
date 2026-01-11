import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany({
        include: {
            agencyProfile: {
                include: {
                    tours: true
                }
            }
        }
    });

    users.forEach(u => {
        if (u.role === 'AGENCY') {
            console.log(`User: ${u.email}`);
            if (u.agencyProfile) {
                console.log(`  Agency: ${u.agencyProfile.name}`);
                u.agencyProfile.tours.forEach(t => {
                    console.log(`    Tour: ${t.title}`);
                });
            }
        }
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
