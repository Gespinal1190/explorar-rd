import Navbar from "@/components/ui/navbar";
import { TourCard } from "@/components/tours/tour-card";
import prisma from "@/lib/prisma";
import Link from "next/link";

export const metadata = {
    title: 'Explorar Tours | Explorar RD',
};

export default async function ToursPage(props: {
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const searchParams = await props.searchParams;
    const search = typeof searchParams?.search === 'string' ? searchParams.search : undefined;
    const location = typeof searchParams?.location === 'string' ? searchParams.location : undefined;

    const query = search || location;
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

    const planPriority: Record<string, number> = {
        'ad_premium_1m': 3,
        'ad_medium_2w': 2,
        'ad_basic_1w': 1,
    };

    let featuredTours = [];
    let regularTours = [];

    try {
        featuredTours = (await prisma.tour.findMany({
            where: {
                featuredExpiresAt: { gt: now },
                ...searchFilter
            } as any,
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
                ...searchFilter
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
                                <span>Resultados para <span className="text-primary">"{query}"</span></span>
                            ) : (
                                "Explorar Excursiones"
                            )}
                        </h1>
                        <p className="text-gray-500 text-base md:text-lg font-medium mb-6 md:mb-8">
                            {query
                                ? `Hemos encontrado ${featuredTours.length + regularTours.length} experiencias que coinciden con tu búsqueda.`
                                : "Descubre las mejores aventuras y destinos de la República Dominicana."
                            }
                        </p>

                        <div className="flex gap-2.5 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 md:mx-0 md:px-0 scroll-smooth">
                            <Link href="/tours" className={`px-5 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap shadow-sm border ${!query ? 'bg-primary text-white border-primary shadow-primary/20' : 'bg-white text-gray-500 border-gray-100'}`}>
                                TOP TODO 🌴
                            </Link>
                            {['Punta Cana', 'Samaná', 'Jarabacoa', 'Bayahíbe', 'Bahía de las Águilas'].map(cat => (
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

            <div className="container mx-auto px-4 py-8 md:py-12 space-y-12 md:space-y-16 mt-4">

                {/* Featured Section */}
                {featuredTours.length > 0 && (
                    <section className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 md:p-12 rounded-3xl md:rounded-[2.5rem] border border-amber-100 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 md:p-12 opacity-10 pointer-events-none hidden sm:block">
                            <span className="text-7xl md:text-9xl">💎</span>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 md:mb-10 relative z-10">
                            <div>
                                <div className="flex items-center gap-2 md:gap-3 mb-2">
                                    <div className="w-8 h-8 md:w-10 md:h-10 bg-amber-400 rounded-lg md:rounded-xl flex items-center justify-center text-sm md:text-xl shadow-lg shadow-amber-200">
                                        🔥
                                    </div>
                                    <h2 className="text-xl md:text-3xl font-black text-gray-900 tracking-tight">Selección Premium</h2>
                                </div>
                                <p className="text-amber-800/70 text-sm md:text-base font-bold max-w-md">Las mejores opciones seleccionadas por su confiabilidad.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 relative z-10">
                            {featuredTours.map((tour) => (
                                <TourCard
                                    key={tour.id}
                                    id={tour.id}
                                    title={tour.title}
                                    price={tour.price}
                                    location={tour.location}
                                    image={tour.images[0]?.url}
                                    agencyName={tour.agency.name}
                                    isAgencyPro={tour.agency.tier === 'PRO'}
                                    currency={tour.currency}
                                    isFeatured={true}
                                    featuredPlan={tour.featuredPlan}
                                />
                            ))}
                        </div>
                    </section>
                )}

                {/* Regular Section */}
                <section>
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                            {query ? "Más resultados" : "Todas las actividades"}
                        </h2>
                        {!query && <span className="text-sm font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">{regularTours.length} Tours</span>}
                    </div>

                    {regularTours.length === 0 && featuredTours.length === 0 ? (
                        <div className="text-center py-24 bg-white rounded-[2.5rem] border border-dashed border-gray-200">
                            <span className="text-6xl mb-6 block">🔍</span>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">No encontramos nada para "{query}"</h3>
                            <p className="text-gray-500 mb-8 max-w-sm mx-auto">Prueba con términos más generales como "Punta Cana" o "Playa".</p>
                            <Link href="/tours" className="inline-block bg-primary text-white font-bold px-8 py-3 rounded-full shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                                Ver todos los tours
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {regularTours.map((tour) => (
                                <TourCard
                                    key={tour.id}
                                    id={tour.id}
                                    title={tour.title}
                                    price={tour.price || 0}
                                    location={tour.location || 'RD'}
                                    image={tour.images?.[0]?.url}
                                    agencyName={tour.agency?.name || 'Agencia Local'}
                                    isAgencyPro={tour.agency?.tier === 'PRO'}
                                    currency={tour.currency || 'DOP'}
                                />
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
