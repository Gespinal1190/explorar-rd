import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    try {
        console.log('Connecting to database...')
        await prisma.$connect()
        console.log('Successfully connected to database!')

        // Try a simple query
        const userCount = await prisma.user.count()
        console.log(`Connection verified. User count: ${userCount}`)

    } catch (e) {
        console.error('Database connection failed:', e)
        process.exit(1)
    } finally {
        await prisma.$disconnect()
    }
}

main()
