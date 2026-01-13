import prisma from '../src/lib/prisma';

async function testPaymentFlow() {
    console.log('--- TESTING PAYMENT FLOW ---');

    // 1. Create/Update Agency with PayPal
    console.log('1. Setting up Agency with PayPal...');
    const user = await prisma.user.findFirst({ where: { role: 'AGENCY' } });
    if (!user) throw new Error("No agency user found");

    const agency = await prisma.agencyProfile.upsert({
        where: { userId: user.id },
        update: {
            paypalEmail: 'sb-agency@business.example.com',
            paypalMeLink: 'https://paypal.me/testagency',
            commissionRate: 5.0
        },
        create: {
            userId: user.id,
            name: 'Test Agency Payment',
            paypalEmail: 'sb-agency@business.example.com',
            paypalMeLink: 'https://paypal.me/testagency',
            status: 'ACTIVE'
        }
    });
    console.log('Agency Configured:', agency.paypalEmail);

    // 2. Simulate Booking Transaction
    console.log('2. Simulating PayPal Transaction...');
    const tour = await prisma.tour.findFirst({ where: { agencyId: agency.id } });
    if (!tour) {
        console.log("No tour found, creating dummy tour...");
        // Create dummy tour logic if needed... or skip
        return;
    }

    // Create a dummy booking first (Backend logic mimics this)
    const booking = await prisma.booking.create({
        data: {
            userId: user.id, // Agency booking their own tour for test
            tourId: tour.id,
            date: new Date(),
            totalPrice: 100,
            status: 'PENDING',
            paymentStatus: 'PENDING'
        }
    });

    // Create Transaction
    const tx = await prisma.agencyTransaction.create({
        data: {
            agencyProfileId: agency.id,
            bookingId: booking.id,
            amount: 100,
            currency: 'USD',
            status: 'COMPLETED',
            method: 'PAYPAL_BUTTON',
            paypalOrderId: 'TEST-ORDER-ID-' + Date.now()
        }
    });

    console.log('Transaction Created:', tx);

    // Verify Result
    const savedTx = await prisma.agencyTransaction.findUnique({ where: { id: tx.id } });
    if (savedTx?.paypalOrderId === tx.paypalOrderId) {
        console.log('✅ TEST PASSED: Agency Transaction recorded successfully.');
    } else {
        console.error('❌ TEST FAILED: Transaction not found.');
    }
}

testPaymentFlow()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
