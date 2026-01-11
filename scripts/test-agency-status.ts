import prisma from '../src/lib/prisma';

async function testAgencyStatus() {
    const agencies = await prisma.agencyProfile.findMany({
        include: {
            user: {
                select: {
                    email: true,
                    role: true
                }
            }
        }
    });

    console.log('=== AGENCY STATUS REPORT ===\n');

    for (const agency of agencies) {
        console.log(`Agency: ${agency.name}`);
        console.log(`Email: ${agency.user.email}`);
        console.log(`Status: ${agency.status}`);
        console.log(`Verified: ${agency.isVerified}`);
        console.log('---');
    }

    await prisma.$disconnect();
}

testAgencyStatus();
