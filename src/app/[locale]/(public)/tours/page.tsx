import Navbar from "@/components/ui/navbar";
import { TourCard } from "@/components/tours/tour-card";
import prisma from "@/lib/prisma";
import { Link } from "@/navigation";
import { getTranslations } from "next-intl/server";

export const metadata = {
    title: 'Explorar Tours | DescubreRD',
};

import { getSession } from "@/lib/session";

export default async function ToursPage(props: {
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const t = await getTranslations("Tours");
    const searchParams = await props.searchParams;
    const search = typeof searchParams?.search === 'string' ? searchParams.search : undefined;
    const location = typeof searchParams?.location === 'string' ? searchParams.location : undefined;
    const category = typeof searchParams?.category === 'string' ? searchParams.category : undefined;

    const session = await getSession();
    const userId = session?.userId ? String(session.userId) : null;

    let userFavorites: string[] = [];
    if (userId) {
        const favs = await prisma.favorite.findMany({
            where: { userId },
            select: { tourId: true }
        });
        userFavorites = favs.map(f => f.tourId);
    }

    const query = search || location || category;
    const now = new Date();

    // Define search filter
    const searchFilter = query ? {
        OR: [
            { title: { contains: query } },
            { location: { contains: query } },
            { agency: { name: { contains: query } } },
            { description: { contains: query } }
        ]
    } : {};

    const priceParam = typeof searchParams?.price === 'string' ? searchParams.price : undefined;
    let priceFilter = {};
    if (priceParam) {
        const [min, max] = priceParam.split('-').map(Number);
        if (!isNaN(min) && !isNaN(max)) {
            priceFilter = {
                price: {
                    gte: min,
                    lte: max
                }
            };
        }
    }

    // Duration Filter
    const durationParam = typeof searchParams?.duration === 'string' ? searchParams.duration : undefined;
    let durationFilter = {};
    if (durationParam) {
        // NOTE: This assumes we have a 'duration' or similar field that we can map. 
        // Since schema might store duration as string (e.g. "4 hours"), we do a loose contains match or basic logic.
        // For accurate filtering, we would need a durationInMinutes integer field. 
        // We will default to a broad string match for now as a "best effort" if schema isn't fully robust.
        if (durationParam === 'short') { // 1-4 hours
            durationFilter = { OR: [{ duration: { contains: 'hora' } }, { duration: { contains: 'hour' } }] };
        } else if (durationParam === 'half') { // Half day
            durationFilter = { duration: { contains: 'medio' } };
        } else if (durationParam === 'full') { // Full day
            durationFilter = { duration: { contains: 'completo' } };
        } else if (durationParam === 'multi') { // 2+ days
            durationFilter = { duration: { contains: 'días' } };
        }
    }

    // Combine filters
    const whereClause = {
        featuredExpiresAt: { gt: now },
        status: 'PUBLISHED',
        ...searchFilter,
        ...priceFilter,
        ...durationFilter
    };

    const planPriority: Record<string, number> = {
        'ad_premium_1m': 3,
        'ad_medium_2w': 2,
        'ad_basic_1w': 1,
    };

    let featuredTours = [];
    let regularTours = [];

    try {
        featuredTours = (await prisma.tour.findMany({
            where: whereClause as any,
            include: { images: true, agency: true },
            orderBy: [
                { createdAt: 'desc' }
            ] as any,
            take: 20
        })) as any[];

        // Sort featured tours by plan priority manually to be safe
        featuredTours.sort((a, b) => {
            const priorityA = planPriority[a.featuredPlan || ''] || 0;
            const priorityB = planPriority[b.featuredPlan || ''] || 0;
            if (priorityA !== priorityB) return priorityB - priorityA;
            return 0;
        });

        regularTours = (await prisma.tour.findMany({
            where: {
                OR: [
                    { featuredExpiresAt: null },
                    { featuredExpiresAt: { lte: now } }
                ],
                status: 'PUBLISHED', // Only show published tours
                ...searchFilter,
                ...priceFilter,
                ...durationFilter
            } as any,
            include: { images: true, agency: true },
            orderBy: [
                { createdAt: 'desc' }
            ] as any
        })) as any[];
    } catch (error) {
        console.error("Tours Query Error:", error);
    }

    return (
        <div className="min-h-screen bg-[#FBFBF8]">
            <Navbar />

            {/* Enhanced Header with Search Feedback */}
            <div className="bg-white border-b border-gray-100">
                <div className="container mx-auto px-4 py-8 md:py-12">
                    <div className="max-w-4xl">
                        <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-2 md:mb-4 tracking-tight leading-tight">
                            {query ? (
                                <span>{t('resultsFor')} <span className="text-primary">"{query}"</span></span>
                            ) : (
                                t('explore')
                            )}
                        </h1>
                        <p className="text-gray-500 text-base md:text-lg font-medium mb-6 md:mb-8">
                            {query
                                ? t('foundMatches', { count: featuredTours.length + regularTours.length })
                                : t('discoverDesc')
                            }
                        </p>

                        <div className="flex gap-2.5 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 md:mx-0 md:px-0 scroll-smooth">
                            <Link href="/tours" className={`px-5 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap shadow-sm border ${!query ? 'bg-primary text-white border-primary shadow-primary/20' : 'bg-white text-gray-500 border-gray-100'}`}>
                                {t('topAll')} 🌴
                            </Link>
                            {['Punta Cana', 'Samaná', 'Jarabacoa', 'Bayahíbe', 'Bahía de las Águilas', 'Aventura', 'Relax', 'Parejas', 'Familia', 'Cultura'].map(cat => (
                                <Link
                                    key={cat}
                                    href={`/tours?search=${cat}`}
                                    className={`px-5 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap shadow-sm border ${query === cat ? 'bg-primary text-white border-primary shadow-primary/20' : 'bg-white text-gray-500 border-gray-100 hover:border-primary/50'}`}
                                >
                                    {cat.toUpperCase()}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 md:py-12 mt-4">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Sidebar */}
                    <aside className="w-full lg:w-64 shrink-0 space-y-8 animate-in slide-in-from-left-4 duration-500">
                        <div>
                            <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-4">{t('filterPrice')}</h3>
                            <div className="space-y-2">
                                {[
                                    { label: t('all'), value: '' },
                                    { label: t('lessThan', { amount: '50 US$' }), value: '0-50' },
                                    { label: t('range', { min: '50 US$', max: '150 US$' }), value: '50-150' },
                                    { label: t('moreThan', { amount: '150 US$' }), value: '150-10000' },
                                ].map((option, idx) => (
                                    <Link
                                        key={idx}
                                        href={option.value ? `/tours?search=${search || ''}&price=${option.value}` : `/tours?search=${search || ''}`}
                                        className={`block text-sm font-medium transition-colors ${(searchParams?.['price'] === option.value) || (!searchParams?.['price'] && option.value === '') ? 'text-primary font-bold' : 'text-gray-600 hover:text-gray-900'}`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${(searchParams?.['price'] === option.value) || (!searchParams?.['price'] && option.value === '') ? 'border-primary' : 'border-gray-300'}`}>
                                                {((searchParams?.['price'] === option.value) || (!searchParams?.['price'] && option.value === '')) && <div className="w-2 h-2 rounded-full bg-primary" />}
                                            </div>
                                            {option.label}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-4">{t('duration')}</h3>
                            <div className="space-y-3">
                                {[
                                    { label: `1-4 ${t('hours')}`, value: 'short' },
                                    { label: t('halfDay'), value: 'half' },
                                    { label: t('fullDay'), value: 'full' },
                                    { label: `2+ ${t('days')}`, value: 'multi' }
                                ].map((d, i) => {
                                    const isSelected = searchParams?.duration === d.value;
                                    return (
                                        <Link
                                            key={i}
                                            href={isSelected
                                                ? `/tours?search=${search || ''}${priceParam ? `&price=${priceParam}` : ''}`
                                                : `/tours?search=${search || ''}&duration=${d.value}${priceParam ? `&price=${priceParam}` : ''}`
                                            }
                                            className={`flex items-center gap-2 text-sm cursor-pointer ${isSelected ? 'text-primary font-bold' : 'text-gray-600 hover:text-gray-900'}`}
                                        >
                                            <div className={`w-4 h-4 rounded border flex items-center justify-center ${isSelected ? 'border-primary bg-primary text-white' : 'border-gray-300'}`}>
                                                {isSelected && <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                            </div>
                                            {d.label}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                            <h4 className="font-bold text-blue-900 text-sm mb-1">{t('needHelp')}</h4>
                            <p className="text-xs text-blue-700 mb-3">{t('helpDesc')}</p>
                            <button className="w-full py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors">
                                {t('contactSupport')}
                            </button>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1 space-y-12">
                        {/* Featured Section */}
                        {featuredTours.length > 0 && (
                            <section>
                                <div className="flex items-center gap-2 mb-6">
                                    <span className="text-xl">💎</span>
                                    <h2 className="text-xl font-black text-gray-900">{t('recommended')}</h2>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {featuredTours.map((tour: any) => (
                                        <TourCard
                                            key={tour.id}
                                            id={tour.id}
                                            slug={tour.slug}
                                            title={tour.title}
                                            price={tour.price || 0}
                                            location={tour.location || 'RD'}
                                            image={tour.images?.[0]?.url}
                                            agencyName={tour.agency?.name || 'Agencia Local'}
                                            isAgencyPro={tour.agency?.tier === 'PRO'}
                                            currency={tour.currency || 'DOP'}
                                            isFeatured={true}
                                            featuredPlan={tour.featuredPlan}
                                            isFavorite={userFavorites.includes(tour.id)}
                                            duration={tour.duration || undefined}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Regular Section */}
                        <section>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-black text-gray-900">
                                    {featuredTours.length > 0 ? t('moreResults') : t('allActivities')}
                                </h2>
                                <span className="text-xs font-bold text-gray-400">{t('resultsCount', { count: regularTours.length })}</span>
                            </div>

                            {regularTours.length === 0 && featuredTours.length === 0 ? (
                                <div className="text-center py-24 bg-white rounded-[2.5rem] border border-dashed border-gray-200">
                                    <span className="text-6xl mb-6 block">🔍</span>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('noResults')} "{query}"</h3>
                                    <p className="text-gray-500 mb-8 max-w-sm mx-auto">{t('tryAdjusting')}</p>
                                    <Link href="/tours" className="inline-block bg-primary text-white font-bold px-8 py-3 rounded-full shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                                        {t('seeAll')}
                                    </Link>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {regularTours.map((tour) => (
                                        <TourCard
                                            key={tour.id}
                                            id={tour.id}
                                            slug={tour.slug}
                                            title={tour.title}
                                            price={tour.price || 0}
                                            location={tour.location || 'RD'}
                                            image={tour.images?.[0]?.url}
                                            agencyName={tour.agency?.name || 'Agencia Local'}
                                            isAgencyPro={tour.agency?.tier === 'PRO'}
                                            currency={tour.currency || 'DOP'}
                                            isFavorite={userFavorites.includes(tour.id)}
                                            duration={tour.duration || undefined}
                                        />
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
