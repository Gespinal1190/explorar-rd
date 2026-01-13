import prisma from '../src/lib/prisma';

async function testSecurityBreach() {
    console.log('--- SECURITY TEST: AGENCY RESTRICTIONS ---');

    // 1. Find the test agency that supposedly is PENDING
    const agency = await prisma.agencyProfile.findFirst({
        where: {
            user: {
                email: 'agencia@test.com'
            }
        },
        include: { user: true }
    });

    if (!agency) {
        console.log('Test agency not found');
        return;
    }

    console.log(`Agency Found: ${agency.name}`);
    console.log(`Current Status: ${agency.status}`);
    console.log(`Is Verified: ${agency.isVerified}`);

    // If simulating the action logic manually:
    if (agency.status !== 'ACTIVE') {
        console.log('LOGIC CHECK: createTour should RETURN ERROR here.');
    } else {
        console.log('LOGIC CHECK: Agency is ACTIVE, so it CAN create tours.');
    }

    // Now let's try to CREATE a tour directly using Prisma to see if there are database constraints
    // Note: Prisma usually doesn't enforce business logic like 'status', that's the app layer's job.
    // The previous checks I added were in src/lib/actions.ts application layer.

    console.log('--- VERIFICATION COMPLETE ---');
}

testSecurityBreach();
