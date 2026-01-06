const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        await prisma.$connect();
        console.log('Successfully connected to Neon Database!');
        const count = await prisma.user.count();
        console.log(`User count: ${count}`);
        const agencyCount = await prisma.agencyProfile.count();
        console.log(`Agency count: ${agencyCount}`);
    } catch (e) {
        console.error('Connection failed:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
