'use server';

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteBooking(bookingId: string) {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
        throw new Error("Unauthorized");
    }

    await prisma.booking.delete({
        where: { id: bookingId }
    });

    revalidatePath("/dashboard/admin/bookings");
}
