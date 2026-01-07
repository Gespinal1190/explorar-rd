"use client";

import Link from "next/link";
import { useState } from "react";
import { toggleFavorite } from "@/lib/actions";

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
    rating?: number;
    isFavorite?: boolean; // Initial state
}

export function TourCard({ id, title, price, location, image, agencyName, isAgencyPro, currency = "DOP", isFeatured, featuredPlan, isFavorite: initialIsFavorite = false }: TourProps) {
    const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
    const [isLoading, setIsLoading] = useState(false);

    const handleToggleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigating to tour details
        if (isLoading) return;

        // Optimistic UI Update
        const previousState = isFavorite;
        setIsFavorite(!isFavorite);
        setIsLoading(true);

        const result = await toggleFavorite(id);

        if (!result.success) {
            // Revert on failure
            setIsFavorite(previousState);
            if (result.message === "Debes iniciar sesión") {
                // Optional: Redirect to login or show toast
                alert("Debes iniciar sesión para agregar favoritos.");
            }
        }
        setIsLoading(false);
    };

    return (
        <div className={`relative bg-white rounded-2xl md:rounded-3xl transition-all duration-500 overflow-hidden border group flex flex-col h-full ${isFeatured ? 'border-amber-400 shadow-[0_8px_30px_rgba(251,191,36,0.15)]' : 'border-gray-100 shadow-sm hover:shadow-xl'}`}>
            {isFeatured && (
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 z-30 animate-pulse"></div>
            )}

            <div className="relative h-48 md:h-64 bg-gray-200 overflow-hidden">
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
                <div className="absolute top-3 left-3 md:top-4 md:left-4 flex flex-col gap-1.5 md:gap-2 z-20">
                    <span className="bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg text-[9px] md:text-[10px] font-bold text-gray-800 shadow-sm flex items-center gap-1 w-fit border border-gray-100/50">
                        📍 {location}
                    </span>
                    {isFeatured && (
                        <span className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-2.5 py-1 rounded-lg text-[9px] md:text-[10px] font-black shadow-lg flex items-center gap-1 w-fit tracking-tighter sm:tracking-normal">
                            ✨ {featuredPlan === 'ad_premium_1m' ? 'SÚPER SELECCIÓN' : 'RECOMENDADO'}
                        </span>
                    )}
                </div>

                <button
                    onClick={handleToggleFavorite}
                    className={`absolute top-3 right-3 md:top-4 md:right-4 p-2 backdrop-blur-md rounded-full transition-all z-20 shadow-sm ${isFavorite ? 'bg-white text-red-500 scale-110' : 'bg-white/50 text-white hover:bg-white hover:text-red-500'}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill={isFavorite ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 md:w-5 md:h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                    </svg>
                </button>
            </div>

            <div className="p-4 md:p-6 flex-1 flex flex-col">
                {agencyName && (
                    <div className="flex items-center justify-between mb-3 md:mb-4">
                        <div className="flex items-center gap-2">
                            <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-[10px] md:text-xs font-bold shadow-inner ${isAgencyPro ? 'bg-gradient-to-tr from-teal-400 to-blue-600 text-white' : 'bg-gray-100 text-gray-500 border border-gray-200'}`}>
                                {agencyName.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex flex-col">
                                <span className={`text-[8px] md:text-[9px] font-black uppercase tracking-[0.1em] ${isAgencyPro ? 'text-teal-600' : 'text-gray-400'}`}>
                                    {isAgencyPro ? 'VIP Partner 🏆' : 'Local Host'}
                                </span>
                                <span className="text-[11px] md:text-sm font-bold text-gray-900 leading-none mt-0.5 truncate max-w-[100px] sm:max-w-none">
                                    {agencyName}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2 leading-snug group-hover:text-primary transition-colors line-clamp-2 min-h-[2.5rem] md:min-h-0">
                    {title}
                </h3>

                {/* Rating Placeholder */}
                <div className="flex items-center gap-1 mb-4">
                    <div className="flex text-amber-400 text-xs md:text-sm">
                        {"★★★★★".split("").map((s, i) => <span key={i}>{s}</span>)}
                    </div>
                    <span className="text-[10px] md:text-xs text-gray-400 font-bold ml-1">4.8</span>
                </div>

                <div className="mt-auto flex items-end justify-between pt-4 border-t border-gray-50">
                    <div>
                        <p className="text-[9px] md:text-xs text-gray-400 font-bold uppercase tracking-tight">Desde</p>
                        <div className="flex items-baseline gap-0.5 md:gap-1">
                            <span className="text-[10px] md:text-sm text-gray-400 font-bold">{currency === 'USD' ? '$' : currency === 'EUR' ? '€' : 'RD$'}</span>
                            <span className="font-black text-lg md:text-xl text-gray-900 leading-none">{price.toLocaleString()}</span>
                        </div>
                    </div>

                    <Link href={`/tours/${id}`} className="px-5 py-2.5 bg-gray-900 lg:bg-gradient-to-r lg:from-[#2DD4BF] lg:to-[#0F766E] text-white text-xs font-bold rounded-xl md:rounded-lg hover:shadow-lg hover:shadow-teal-500/20 transition-all shadow-md active:scale-95">
                        Explorar
                    </Link>
                </div>
            </div>
        </div>
    );
}
