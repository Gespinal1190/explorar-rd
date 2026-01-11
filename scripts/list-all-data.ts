import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const agencies = await prisma.agencyProfile.findMany({
        include: {
            user: true,
            tours: true,
        }
    });

    console.log(JSON.stringify(agencies, null, 2));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
