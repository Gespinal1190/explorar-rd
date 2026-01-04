
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    // 1. Get a valid user
    const user = await prisma.user.findFirst()
    if (!user) {
        console.log("No user found")
        return
    }
    console.log("Using user:", user.email, user.id)

    // 2. Get a valid tour
    const tour = await prisma.tour.findFirst()
    if (!tour) {
        console.log("No tour found")
        return
    }
    console.log("Using tour:", tour.title, tour.id)

    // 3. Try to create a booking
    try {
        const booking = await prisma.booking.create({
            data: {
                userId: user.id,
                tourId: tour.id,
                date: new Date(),
                people: 2,
                totalPrice: 100,
                status: 'PENDING',
                paymentMethod: 'cash',
                paymentStatus: 'PENDING'
            }
        })
        console.log("Booking created successfully:", booking.id)
    } catch (e) {
        console.error("Error creating booking:", e)
    }
}

main()
