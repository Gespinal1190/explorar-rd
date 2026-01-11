import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const tours = await prisma.tour.findMany({
        orderBy: { createdAt: 'desc' },
        include: { agency: true },
        take: 20
    });

    tours.forEach(t => {
        console.log(`Title: ${t.title}, CreatedAt: ${t.createdAt}, Agency: ${t.agency.name}`);
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
