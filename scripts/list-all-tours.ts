import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const tours = await prisma.tour.findMany({
        include: {
            agency: true
        }
    });

    tours.forEach(t => {
        console.log(`- ${t.title} (ID: ${t.id}, Agency: ${t.agency.name})`);
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
