'use server';

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function submitPaymentReceipt(bookingId: string, receiptUrl: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const booking = await prisma.booking.findUnique({
        where: { id: bookingId }
    });

    if (!booking || booking.userId !== session.user.id) {
        throw new Error("Reserva no encontrada");
    }

    await prisma.booking.update({
        where: { id: bookingId },
        data: {
            paymentReceiptUrl: receiptUrl
            // We could update status here, but usually agency does that after verification. 
            // Maybe notify agency?
        }
    });

    revalidatePath("/dashboard/user/bookings");
}
