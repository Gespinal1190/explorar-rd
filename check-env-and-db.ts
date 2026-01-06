const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

async function check() {
    console.log("--- Checking .env Keys ---");
    const env = fs.readFileSync('.env', 'utf8');
    const hasGoogleId = env.includes('AUTH_GOOGLE_ID');
    const hasGoogleSecret = env.includes('AUTH_GOOGLE_SECRET');
    console.log(`AUTH_GOOGLE_ID present: ${hasGoogleId}`);
    console.log(`AUTH_GOOGLE_SECRET present: ${hasGoogleSecret}`);

    console.log("--- Checking Prisma Query ---");
    const prisma = new PrismaClient();
    try {
        const tours = await prisma.tour.findMany({ take: 1 });
        console.log("Prisma Query Successful. Tours found:", tours.length);
    } catch (e) {
        console.error("Prisma Query Failed:", e);
    } finally {
        await prisma.$disconnect();
    }
}

check();
