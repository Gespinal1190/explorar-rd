
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
    const tour = await prisma.tour.findFirst()
    console.log("TOUR_ID:", tour?.id)
}
main()
