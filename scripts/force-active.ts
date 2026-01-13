import prisma from '../src/lib/prisma';

async function fixTestAgency() {
    console.log('--- FIXING TEST AGENCY ---');

    const email = 'agencia@test.com';

    // 1. Get Agency
    const agency = await prisma.agencyProfile.findFirst({
        where: { user: { email } },
        include: { user: true }
    });

    if (!agency) {
        console.log('Wait, agency not found!');
        return;
    }

    // 2. FORCE UPDATE to ACTIVE
    const updated = await prisma.agencyProfile.update({
        where: { id: agency.id },
        data: {
            status: 'ACTIVE',
            isVerified: true
        }
    });

    console.log(`Agency ${updated.name} is now:`);
    console.log(`- Status: ${updated.status}`);
    console.log(`- Verified: ${updated.isVerified}`);
    console.log('--- FIX COMPLETE ---');
}

fixTestAgency();
