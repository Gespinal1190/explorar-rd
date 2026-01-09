import { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const tours = await prisma.tour.findMany({ select: { id: true, updatedAt: true } });

    const tourUrls = tours.map((tour) => ({
        url: `https://descubrerd.com/tours/${tour.id}`,
        lastModified: tour.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    return [
        {
            url: 'https://descubrerd.com',
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: 'https://descubrerd.com/tours',
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        ...tourUrls,
    ];
}
