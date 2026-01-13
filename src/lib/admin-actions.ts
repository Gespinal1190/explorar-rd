'use server';

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updatePlanPrice(slug: string, newPrice: number) {
    const session = await auth();
    if (!session || session.user.role !== 'ADMIN') {
        return { error: 'No autorizado' };
    }

    try {
        await (prisma as any).plan.update({
            where: { slug },
            data: { price: newPrice }
        });
        revalidatePath('/dashboard/admin/settings');
        return { success: true };
    } catch (error) {
        return { error: 'Error al actualizar precio' };
    }
}

export async function updateAgencyPaymentSettings(agencyId: string, formData: FormData) {
    const session = await auth();
    if (!session || session.user.role !== 'ADMIN') {
        return { error: 'No autorizado' };
    }

    const paypalEmail = formData.get('paypalEmail') as string;
    const paypalMeLink = formData.get('paypalMeLink') as string;
    const commissionRate = parseFloat(formData.get('commissionRate') as string || '0');

    try {
        await prisma.agencyProfile.update({
            where: { id: agencyId },
            data: {
                paypalEmail: paypalEmail || null,
                paypalMeLink: paypalMeLink || null,
                commissionRate
            }
        });
        revalidatePath(`/dashboard/admin/agencies/${agencyId}`);
        return { success: true, message: 'Configuración de pagos actualizada' };
    } catch (error) {
        console.error("Error updating payment settings:", error);
        return { error: 'Error al actualizar configuración' };
    }
}
