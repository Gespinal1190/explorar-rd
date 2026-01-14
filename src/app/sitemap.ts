import { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // @ts-ignore - slug exists after prisma generate
    const tours = await prisma.tour.findMany({ select: { slug: true, updatedAt: true } });

    const tourUrls = tours.flatMap((tour: any) => {
        const languages = ['es', 'en', 'fr'];
        return languages.map(lang => ({
            url: `https://descubrerd.app/${lang}/tours/${tour.slug}`,
            lastModified: tour.updatedAt,
            changeFrequency: 'weekly' as const,
            priority: 0.8,
            alternates: {
                languages: {
                    es: `https://descubrerd.app/es/tours/${tour.slug}`,
                    en: `https://descubrerd.app/en/tours/${tour.slug}`,
                    fr: `https://descubrerd.app/fr/tours/${tour.slug}`,
                },
            },
        }));
    });

    const staticRoutes = [
        { path: '', priority: 1.0 },
        { path: '/tours', priority: 0.9 },
        { path: '/login', priority: 0.1 },
    ];

    const staticUrls = staticRoutes.flatMap(route => {
        const languages = ['es', 'en', 'fr'];
        return languages.map(lang => ({
            url: `https://descubrerd.app/${lang}${route.path}`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: route.priority,
            alternates: {
                languages: {
                    es: `https://descubrerd.app/es${route.path}`,
                    en: `https://descubrerd.app/en${route.path}`,
                    fr: `https://descubrerd.app/fr${route.path}`,
                },
            },
        }));
    });

    return [
        ...staticUrls,
        ...tourUrls,
    ];
}
