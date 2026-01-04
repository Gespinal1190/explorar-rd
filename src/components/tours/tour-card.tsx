import Link from "next/link";

interface TourProps {
    id: string;
    title: string;
    price: number;
    location: string;
    image?: string;
    agencyName?: string;
    isAgencyPro?: boolean;
    currency?: string;
    isFeatured?: boolean;
    featuredPlan?: string;
    rating?: number; // Added rating prop (optional)
}

export function TourCard({ id, title, price, location, image, agencyName, isAgencyPro, currency = "DOP", isFeatured, featuredPlan }: TourProps) {
    return (
        <div className={`relative bg-white rounded-2xl transition-all duration-500 overflow-hidden border group flex flex-col h-full ${isFeatured ? 'border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.2)]' : 'border-gray-100 shadow-sm hover:shadow-xl'}`}>
            {isFeatured && (
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 z-30 animate-pulse"></div>
            )}

            <div className="relative h-64 bg-gray-200 overflow-hidden">
                {image ? (
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 bg-gray-100 text-sm font-medium">
                        Sin imagen
                    </div>
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
                    <span className="bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-gray-800 shadow-sm flex items-center gap-1 w-fit">
                        📍 {location}
                    </span>
                    {isFeatured && (
                        <span className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-3 py-1 rounded-full text-[10px] font-black shadow-lg flex items-center gap-1 w-fit animate-bounce-subtle">
                            🔥 {featuredPlan === 'ad_premium_1m' ? 'SÚPER DESTACADO' : 'DESTACADO'}
                        </span>
                    )}
                </div>

                <button className="absolute top-4 right-4 p-2 bg-white/50 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-red-500 transition-colors z-20">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                    </svg>
                </button>
            </div>

            <div className="p-6 flex-1 flex flex-col">
                {agencyName && (
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-inner ${isAgencyPro ? 'bg-gradient-to-tr from-teal-400 to-blue-600 text-white' : 'bg-gray-100 text-gray-500 border border-gray-200'}`}>
                                {agencyName.charAt(0)}
                            </div>
                            <div className="flex flex-col">
                                <span className={`text-[10px] font-black uppercase tracking-widest ${isAgencyPro ? 'text-teal-600' : 'text-gray-400'}`}>
                                    {isAgencyPro ? 'Socio Verificado 🏆' : 'Agencia Local'}
                                </span>
                                <span className="text-sm font-bold text-gray-900 leading-none mt-0.5">
                                    {agencyName}
                                </span>
                            </div>
                        </div>
                        {isAgencyPro && (
                            <div className="bg-teal-50 text-teal-600 p-1 rounded-lg border border-teal-100">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                    <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.491 4.491 0 0 1-3.497-1.307 4.491 4.491 0 0 1-1.307-3.497A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                                </svg>
                            </div>
                        )}
                    </div>
                )}

                <h3 className="text-lg font-bold text-gray-900 mb-2 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                    {title}
                </h3>

                {/* Rating Placeholder */}
                <div className="flex items-center gap-1 mb-4">
                    <span className="text-yellow-400 text-sm">★★★★★</span>
                    <span className="text-xs text-gray-400 font-medium">(4.8)</span>
                </div>

                <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
                    <div>
                        <p className="text-xs text-gray-400 font-medium uppercase">Precio por persona</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-sm text-gray-400 font-medium">{currency === 'USD' ? 'USD$' : currency === 'EUR' ? '€' : 'RD$'}</span>
                            <span className="font-black text-xl text-gray-900">{price.toLocaleString()}</span>
                        </div>
                    </div>

                    <Link href={`/tours/${id}`} className="px-4 py-2 bg-gradient-to-r from-[#2DD4BF] to-[#0F766E] text-white text-sm font-bold rounded-lg hover:shadow-lg hover:shadow-teal-500/20 transition-all shadow-md">
                        Ver Detalles
                    </Link>
                </div>
            </div>
        </div>
    );
}
