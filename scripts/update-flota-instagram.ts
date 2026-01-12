import prisma from '../src/lib/prisma';

async function updateFlotaInstagram() {
    const updated = await prisma.agencyProfile.updateMany({
        where: {
            user: {
                email: 'flotalaex@gmail.com'
            }
        },
        data: {
            instagram: 'https://www.instagram.com/laextours/'
        }
    });

    console.log(`Updated ${updated.count} agency profile(s)`);

    // Verify
    const agency = await prisma.agencyProfile.findFirst({
        where: {
            user: {
                email: 'flotalaex@gmail.com'
            }
        },
        include: {
            user: {
                select: {
                    email: true
                }
            }
        }
    });

    console.log('\nAgency info after update:');
    console.log(`Email: ${agency?.user.email}`);
    console.log(`Phone: ${agency?.phone}`);
    console.log(`WhatsApp: ${agency?.whatsapp}`);
    console.log(`Website: ${agency?.website}`);
    console.log(`Instagram: ${agency?.instagram}`);

    await prisma.$disconnect();
}

updateFlotaInstagram();
