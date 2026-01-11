import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const tours = await prisma.tour.findMany({
        where: {
            OR: [
                { title: { contains: 'Cayo Arena', mode: 'insensitive' } },
                { description: { contains: 'Cayo Arena', mode: 'insensitive' } },
                { title: { contains: 'Flota', mode: 'insensitive' } },
            ]
        },
        include: {
            agency: true
        }
    });

    console.log(JSON.stringify(tours, null, 2));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
