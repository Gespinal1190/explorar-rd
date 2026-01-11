import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const user = await prisma.user.findUnique({
        where: { email: 'flotalaex@gmail.com' },
        include: {
            agencyProfile: {
                include: {
                    tours: {
                        include: {
                            images: true,
                            dates: true,
                        }
                    }
                }
            }
        }
    });

    console.log(JSON.stringify(user, null, 2));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
