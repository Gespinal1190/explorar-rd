'use server';

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateBookingStatus(bookingId: string, status: string) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("No autorizado");
    }

    // Verify agency owns the booking
    const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: { tour: { include: { agency: true } } }
    });

    if (!booking) {
        throw new Error("Reserva no encontrada");
    }

    if (booking.tour.agency.userId !== session.user.id) {
        throw new Error("No tienes permiso para modificar esta reserva");
    }

    await prisma.booking.update({
        where: { id: bookingId },
        data: { status }
    });

    revalidatePath("/dashboard/agency/bookings");
}

export async function updatePaymentStatus(bookingId: string, paymentStatus: string) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("No autorizado");
    }

    // Verify agency owns the booking
    const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: { tour: { include: { agency: true } } }
    });

    if (!booking) {
        throw new Error("Reserva no encontrada");
    }

    if (booking.tour.agency.userId !== session.user.id) {
        throw new Error("No tienes permiso para modificar esta reserva");
    }

    await prisma.booking.update({
        where: { id: bookingId },
        data: { paymentStatus }
    });

    revalidatePath("/dashboard/agency/bookings");
}
