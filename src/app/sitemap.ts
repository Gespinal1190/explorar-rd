import { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const tours = await prisma.tour.findMany({ select: { slug: true, updatedAt: true } });

    const tourUrls = tours.map((tour) => ({
        url: `https://descubrerd.app/tours/${tour.slug}`,
        lastModified: tour.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    return [
        {
            url: 'https://descubrerd.app',
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: 'https://descubrerd.app/tours',
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        ...tourUrls,
    ];
}
