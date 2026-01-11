import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const user = await prisma.user.findUnique({
        where: { email: 'flotalaex@gmail.com' },
        include: {
            agencyProfile: {
                include: {
                    tours: true
                }
            }
        }
    });

    if (user && user.agencyProfile) {
        console.log(`Agency: ${user.agencyProfile.name}`);
        console.log(`Tours found: ${user.agencyProfile.tours.length}`);
        user.agencyProfile.tours.forEach(t => {
            console.log(`- Tour: ${t.title} (${t.slug}), Price: ${t.price}`);
        });
    } else {
        console.log('User or Agency not found');
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
