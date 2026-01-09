
import Navbar from "@/components/ui/navbar";
import prisma from "@/lib/prisma";
import Link from "next/link";

// Helper component for star ratings
const RatingStars = ({ rating = 5 }) => (
    <div className="flex gap-0.5 text-amber-400 text-xs">
        {[...Array(5)].map((_, i) => (
            <span key={i}>{i < rating ? "★" : "☆"}</span>
        ))}
    </div>
);

export const dynamic = "force-dynamic";

export async function generateMetadata() {
    return { title: 'Mejores Agencias de Turismo | DescubreRD' };
}

export default async function AgenciesPage() {
    // Fetch agencies, sorting PREMIUM first
    const agencies = await prisma.agencyProfile.findMany({
        where: { isVerified: true }, // Optional: only show verified
        orderBy: [
            { tier: 'desc' }, // PREMIUM > FREE (assuming 'PREMIUM' > 'FREE' alphabetically? No, P > F. Wait. FREE vs PREMIUM. P is after F. so 'desc' puts PREMIUM first. 
            // Better to rely on specific sort if we had an enum or distinct values.
            // Let's assume tier is "PREMIUM" vs "FREE".
            { createdAt: 'desc' }
        ],
        include: {
            tours: {
                select: { id: true }
            }
        }
    });

    // Manually sort to be safe if database sort isn't enough (e.g. strict "PREMIUM" check)
    const sortedAgencies = [...agencies].sort((a, b) => {
        if (a.tier === 'PREMIUM' && b.tier !== 'PREMIUM') return -1;
        if (a.tier !== 'PREMIUM' && b.tier === 'PREMIUM') return 1;
        return 0;
    });

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Navbar />

            {/* Header */}
            <div className="bg-white border-b border-gray-100 py-12 md:py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
                        Agencias Destacadas
                    </h1>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                        Descubre los mejores operadores turísticos de la República Dominicana, verificados y calificados por nuestra comunidad.
                    </p>
                </div>
            </div>

            {/* Grid */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {sortedAgencies.map((agency) => {
                        const isPremium = agency.tier === 'PREMIUM';
                        const gradients = [
                            "from-blue-500 to-indigo-600",
                            "from-purple-500 to-pink-600",
                            "from-emerald-400 to-teal-600",
                            "from-orange-400 to-red-500"
                        ];
                        const gradient = gradients[agency.id.charCodeAt(0) % gradients.length];

                        return (
                            <Link
                                key={agency.id}
                                href={`/agencies/${agency.id}`}
                                className={`group relative bg-white rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1 ${isPremium
                                    ? 'shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] ring-2 ring-transparent ring-offset-2 hover:ring-indigo-500'
                                    : 'shadow-sm border border-gray-100 hover:shadow-md'
                                    }`}
                            >
                                {/* Premium Badge & Glow */}
                                {isPremium && (
                                    <>
                                        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                                        <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-500 inset-0 bg-gradient-to-tr from-indigo-500/5 to-purple-500/5 pointer-events-none"></div>
                                        <span className="absolute top-4 right-4 bg-gradient-to-r from-amber-200 to-yellow-400 text-yellow-900 text-[10px] font-black px-2 py-0.5 rounded shadow-sm border border-yellow-300 tracking-wide uppercase">
                                            Premium
                                        </span>
                                    </>
                                )}

                                {/* Card Header with Logo */}
                                <div className={`h-24 ${isPremium ? 'bg-gray-50' : 'bg-gray-50/50'} relative`}>
                                    {/* Abstract Background Decoration */}
                                    <div className={`absolute inset-0 opacity-10 bg-gradient-to-br ${gradient}`}></div>

                                    <div className="absolute -bottom-6 left-6">
                                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm border-2 border-white ${isPremium ? 'bg-gradient-to-br from-indigo-600 to-purple-700 text-white' : 'bg-white text-gray-400'}`}>
                                            {agency.logo ? (
                                                <img src={agency.logo} alt={agency.name} className="w-full h-full object-cover rounded-xl" />
                                            ) : (
                                                <span className="text-xl font-black">{agency.name.charAt(0)}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="pt-10 pb-6 px-6">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-bold text-gray-900 text-lg leading-tight truncate">
                                            {agency.name}
                                        </h3>
                                        {agency.isVerified && (
                                            <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 mb-4">
                                        <RatingStars rating={5} />
                                        <span className="text-xs text-gray-400 font-medium">5.0 (24)</span>
                                    </div>

                                    <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
                                        <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
                                            🏝️ {agency.tours.length} Tours
                                        </span>
                                        {isPremium && (
                                            <span className="flex items-center gap-1.5 text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                                                🏆 Top Partner
                                            </span>
                                        )}
                                    </div>

                                    {/* Action Button visibility on hover for non-touch */}
                                    <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between opacity-60 group-hover:opacity-100 transition-opacity">
                                        <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Ver Perfil</span>
                                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {sortedAgencies.length === 0 && (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">🏜️</div>
                        <h3 className="text-xl font-bold text-gray-900">No hay agencias disponibles</h3>
                        <p className="text-gray-500">Sé el primero en unirte a nuestra plataforma.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
