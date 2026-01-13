import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Verify User Exists (Session might be stale after seed)
        const userExists = await prisma.user.findUnique({ where: { id: session.user.id } });
        if (!userExists) {
            return NextResponse.json({ error: "Sesión inválida. Por favor inicia sesión nuevamente." }, { status: 401 });
        }

        const body = await req.json();
        console.log("Booking Request Body (Raw):", body);
        const { tourId, date, time, people, totalPrice, paymentMethod, phone } = body;

        if (!tourId || !date || !people) {
            console.error("Missing fields:", { tourId, date, people });
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // If phone is provided, update user profile
        if (phone) {
            await prisma.user.update({
                where: { id: session.user.id },
                data: { phone }
            });
        }

        // Validate Tour Exists
        const tour = await prisma.tour.findUnique({ where: { id: tourId } });
        if (!tour) {
            return NextResponse.json({ error: "El tour seleccionado ya no está disponible o no existe." }, { status: 404 });
        }

        console.log("Creating booking with data:", {
            userId: session.user.id,
            tourId,
            date: new Date(date),
            startTime: time,
            people: Number(people), // Ensure number
            totalPrice: Number(totalPrice), // Ensure number
            paymentMethod
        });

        // Create the booking
        const booking = await prisma.booking.create({
            data: {
                userId: session.user.id,
                tourId: tourId,
                date: new Date(date),
                startTime: time,
                people: Number(people),
                totalPrice: Number(totalPrice),
                status: 'PENDING',
                paymentMethod: paymentMethod,
                paymentStatus: 'PENDING'
            }
        });

        // Handle PayPal Payment Recording
        const { paymentDetails } = body;
        if (paymentMethod === 'paypal' && paymentDetails?.id) {
            // Create Transaction Record
            try {
                await prisma.agencyTransaction.create({
                    data: {
                        agencyProfileId: tour.agencyId,
                        bookingId: booking.id,
                        amount: Number(totalPrice),
                        currency: tour.currency,
                        status: 'COMPLETED',
                        method: 'PAYPAL_BUTTON',
                        paypalOrderId: paymentDetails.id
                    }
                });

                // Update Booking Status
                await prisma.booking.update({
                    where: { id: booking.id },
                    data: {
                        paymentStatus: 'PAID',
                        status: 'CONFIRMED'
                    }
                });

                // Update local object for response
                booking.paymentStatus = 'PAID';
                booking.status = 'CONFIRMED';
            } catch (txError) {
                console.error("Error creating transaction record:", txError);
                // Don't fail the request, but log it. Booking is created.
            }
        }

        return NextResponse.json({ success: true, booking });
    } catch (error) {
        console.error("Booking creation error:", error);
        return NextResponse.json({
            error: "Error interno del servidor",
            details: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}
