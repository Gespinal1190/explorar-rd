'use server';

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function upgradeAgencyTier(
    planSlug: string
) {
    const session = await auth();
    if (!session || session.user.role !== 'AGENCY') {
        return { error: 'No autorizado' };
    }

    try {
        const agency = await prisma.agencyProfile.findUnique({
            where: { userId: session.user.id }
        });

        if (!agency) {
            return { error: 'Agencia no encontrada' };
        }

        const plan = await (prisma as any).plan.findUnique({
            where: { slug: planSlug }
        });

        if (!plan || plan.type !== 'MEMBERSHIP') {
            return { error: 'Plan no válido' };
        }

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + plan.durationDays);

        await prisma.agencyProfile.update({
            where: { id: agency.id },
            data: {
                tier: 'PRO',
                tierExpiresAt: expiresAt
            } as any
        });

        revalidatePath('/dashboard/agency/membership');
        return { success: true };
    } catch (error) {
        console.error("Error upgrading tier:", error);
        return { error: 'Error al procesar la membresía' };
    }
}
