'use server';

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session";

/**
 * Moderates a tour by updating its status or deleting it.
 * This is an Admin-only action.
 */
export async function moderateTour(tourId: string, action: 'DELETE' | 'PAUSE' | 'PUBLISH') {
    const session = await getSession();

    // Authorization Check
    if (!session || session.role !== 'ADMIN') {
        throw new Error("Unauthorized: Only admins can moderate tours.");
    }

    try {
        if (action === 'DELETE') {
            // Soft delete by setting status to ARCHIVED, or hard delete?
            // User requested "borrarlos", but "ARCHIVED" is safer. 
            // Let's implement ARCHIVED which effectively removes it from public view.
            // Or actual delete if prisma cascade is set up correctly (it is).

            // Let's delete it for real to clean up 'bad content'.
            await prisma.tour.delete({
                where: { id: tourId }
            });
        } else if (action === 'PAUSE') {
            await prisma.tour.update({
                where: { id: tourId },
                data: { status: 'PAUSED' }
            });
        } else if (action === 'PUBLISH') {
            await prisma.tour.update({
                where: { id: tourId },
                data: { status: 'PUBLISHED' }
            });
        }

        revalidatePath("/dashboard/admin/tours");
        revalidatePath("/tours"); // Update public list
        return { success: true, message: "Acción completada exitosamente" };
    } catch (error) {
        console.error("Moderation error:", error);
        return { success: false, message: "Error al moderar el tour" };
    }
}
