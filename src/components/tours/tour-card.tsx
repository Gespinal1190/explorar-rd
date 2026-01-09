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

            <div className="p-5 flex-1 flex flex-col">
                {agencyName && (
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2.5">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shadow-sm ${isAgencyPro || isFeatured ? 'bg-gradient-to-br from-teal-400 to-emerald-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                {agencyName.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 flex items-center gap-1">
                                    {(isAgencyPro || isFeatured) && <svg className="w-3 h-3 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>}
                                    {isAgencyPro ? 'Partner Verificado' : 'Agencia Local'}
                                </span>
                                <span className="text-xs font-bold text-gray-900 truncate max-w-[140px]">
                                    {agencyName}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                <h3 className="text-lg font-bold text-gray-900 mb-3 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                    {title}
                </h3>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="bg-gray-50 rounded-lg p-2 flex items-center gap-2">
                        <span className="text-gray-400">⏱️</span>
                        <span className="text-xs font-bold text-gray-700">4 - 6 Horas</span> {/* Placeholder duration until prop is passed */}
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2 flex items-center gap-2">
                        <span className="text-gray-400">👥</span>
                        <span className="text-xs font-bold text-gray-700">Grupos Pequeños</span>
                    </div>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">Precio Total</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-xs font-bold text-gray-400">{currency === 'USD' ? 'US$' : 'RD$'}</span>
                            <span className="text-xl font-black text-gray-900">{price.toLocaleString()}</span>
                        </div>
                    </div>

                    <Link href={`/tours/${id}`} className="group/btn relative px-6 py-3 bg-gray-900 overflow-hidden rounded-xl text-white text-xs font-bold shadow-lg transition-all hover:scale-105 active:scale-95">
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-teal-500 to-emerald-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                        <span className="relative flex items-center gap-2">
                            Reservar
                            <svg className="w-3 h-3 transition-transform group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                        </span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
