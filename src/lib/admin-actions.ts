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
