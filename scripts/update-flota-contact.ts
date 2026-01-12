import prisma from '../src/lib/prisma';

async function updateFlotaPhone() {
    const updated = await prisma.agencyProfile.updateMany({
        where: {
            user: {
                email: 'flotalaex@gmail.com'
            }
        },
        data: {
            phone: '(809) 756-3786',
            whatsapp: '18097563786',
            website: 'https://laextours.com/'
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

    await prisma.$disconnect();
}

updateFlotaPhone();
