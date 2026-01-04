'use server';

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function promoteTour(
    tourId: string,
    planSlug: string
) {
    const session = await auth();
    if (!session || session.user.role !== 'AGENCY') return { error: "No autorizado" };

    // Validate ownership
    const agency = await prisma.agencyProfile.findUnique({ where: { userId: session.user.id } });
    if (!agency) return { error: "Agencia no encontrada" };

    const [tour, plan] = await Promise.all([
        prisma.tour.findFirst({
            where: { id: tourId, agencyId: agency.id }
        }),
        (prisma as any).plan.findUnique({
            where: { slug: planSlug }
        })
    ]);

    if (!tour) return { error: "Tour no encontrado o no tienes permiso" };
    if (!plan) return { error: "Plan de promoción no válido" };

    // Calculate Expiration
    const now = new Date();
    const expiresAt = new Date();
    expiresAt.setDate(now.getDate() + plan.durationDays);

    try {
        await prisma.tour.update({
            where: { id: tourId },
            data: {
                featuredPlan: plan.slug,
                featuredExpiresAt: expiresAt
            } as any
        });

        revalidatePath(`/dashboard/agency/tours`);
        return { success: true };
    } catch (error) {
        console.error("Error promoting tour", error);
        return { error: "Error al activar promoción" };
    }
}
