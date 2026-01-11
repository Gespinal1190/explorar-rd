import prisma from '../src/lib/prisma';

async function updateAgencyStatus() {
    // Update test agency to PENDING
    const updated = await prisma.agencyProfile.updateMany({
        where: {
            user: {
                email: 'agencia@test.com'
            }
        },
        data: {
            status: 'PENDING',
            isVerified: false,
            tier: 'FREE'
        }
    });

    console.log(`Updated ${updated.count} agency to PENDING status`);

    // Verify
    const agency = await prisma.agencyProfile.findFirst({
        where: {
            user: {
                email: 'agencia@test.com'
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

    console.log('\nAgency status after update:');
    console.log(`Email: ${agency?.user.email}`);
    console.log(`Status: ${agency?.status}`);
    console.log(`Verified: ${agency?.isVerified}`);
    console.log(`Tier: ${agency?.tier}`);

    await prisma.$disconnect();
}

updateAgencyStatus();
