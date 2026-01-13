import prisma from '../src/lib/prisma';

async function checkAgencyStatus() {
    console.log('--- CHECK AGENCY STATUS ---');

    const agency = await prisma.agencyProfile.findFirst({
        where: {
            user: {
                email: 'agencia@test.com'
            }
        },
        include: { user: true }
    });

    if (!agency) {
        console.log('Agency not found');
        return;
    }

    console.log(`Agency Name: ${agency.name}`);
    console.log(`User Email: ${agency.user.email}`);
    console.log(`DB Status (Enum): ${agency.status}`); // This is the TRUTH
    console.log(`isVerified (Boolean): ${agency.isVerified}`);

    console.log('--- END CHECK ---');
}

checkAgencyStatus();
