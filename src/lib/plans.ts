import prisma from "@/lib/prisma";

export const DEFAULT_PLANS = [
    // AD PLANS (Promociones de anuncios)
    {
        type: 'AD',
        slug: 'ad_basic_1w',
        name: 'Plan Impulso (1 Semana)',
        price: 500,
        durationDays: 7,
        description: 'Ideal para pruebas rápidas y excursiones de fin de semana.',
        features: JSON.stringify([
            'Aparece en la sección Destacados',
            'Sello de "Recomendado" por 7 días',
            'Visibilidad x2 sobre anuncios estándar'
        ])
    },
    {
        type: 'AD',
        slug: 'ad_medium_2w',
        name: 'Plan Estelar (2 Semanas)',
        price: 850,
        durationDays: 14,
        description: 'Perfecto para lanzamientos de temporada.',
        features: JSON.stringify([
            'Aparece en la sección Destacados',
            'Sello de "Recomendado" por 14 días',
            'Visibilidad x4 sobre anuncios estándar',
            'Prioridad en búsquedas por zona'
        ])
    },
    {
        type: 'AD',
        slug: 'ad_premium_1m',
        name: 'Plan Galaxia (1 Mes)',
        price: 1500,
        durationDays: 30,
        description: 'Máximo rendimiento para agencias consolidadas.',
        features: JSON.stringify([
            'Aparece en la sección Destacados',
            'Sello de "Recomendado" por 30 días',
            'Visibilidad x10 sobre anuncios estándar',
            'Prioridad máxima en todas las búsquedas',
            'Analíticas semanales de rendimiento'
        ])
    },
    // MEMBERSHIP PLANS (Suscripciones de Agencias)
    {
        type: 'MEMBERSHIP',
        slug: 'membership_pro_1m',
        name: 'Agencia PRO (Mensual)',
        price: 2500,
        durationDays: 30,
        description: 'Todos los beneficios para tu negocio día a día.',
        features: JSON.stringify([
            'Insignia de Socio Verificado PRO',
            '0% de comisión por plataforma',
            'Soporte prioritario por WhatsApp',
            'Subida ilimitada de excursiones',
            'Botón de contacto directo resaltado'
        ])
    },
    {
        type: 'MEMBERSHIP',
        slug: 'membership_pro_1y',
        name: 'Agencia PRO (Anual)',
        price: 25000,
        durationDays: 365,
        description: 'Ahorro masivo para socios de largo plazo.',
        features: JSON.stringify([
            'Todos los beneficios del Plan Mensual',
            'Ahorra RD$ 5,000 al año (2 meses gratis)',
            'Reportes trimestrales de mercado',
            'Acceso anticipado a nuevas funciones',
            'Consultoría de marketing personalizada'
        ])
    }
];

export async function ensurePlansExist() {
    try {
        const count = await (prisma as any).plan.count();
        if (count > 0) return;

        console.log("Seeding default plans...");
        for (const plan of DEFAULT_PLANS) {
            await (prisma as any).plan.upsert({
                where: { slug: plan.slug },
                update: {},
                create: plan
            });
        }
    } catch (e) {
        console.error("Error seeding plans:", e);
    }
}

export async function getPlans(type?: 'AD' | 'MEMBERSHIP') {
    try {
        // Ensure plans exist if requested
        await ensurePlansExist();

        return await (prisma as any).plan.findMany({
            where: { ...(type ? { type } : {}) },
            orderBy: { price: 'asc' }
        });
    } catch (e) {
        console.error("Error getting plans:", e);
        return [];
    }
}
