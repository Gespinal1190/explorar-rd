"use client";

import { useState, useEffect } from "react";
import { useRouter } from "@/navigation";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";

export function SearchOverlay() {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [mounted, setMounted] = useState(false);
    const router = useRouter();
    const t = useTranslations('Search');

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (search.trim()) {
            router.push(`/tours?search=${encodeURIComponent(search)}`);
            setIsOpen(false);
        }
    };

    const categories = [
        { key: 'beaches', icon: '🏖️' },
        { key: 'mountains', icon: '⛰️' },
        { key: 'buggies', icon: '🏎️' },
        { key: 'catamaran', icon: '⛵' },
        { key: 'cultural', icon: '🎭' },
        { key: 'couples', icon: '💑' },
        { key: 'family', icon: '👨‍👩‍👧‍👦' }
    ];

    const trendingDestinations = [
        { name: 'Punta Cana', icon: '🌴', descKey: 'puntaCanaDesc' },
        { name: 'Samaná', icon: '🐋', descKey: 'samanaDesc' },
        { name: 'Jarabacoa', icon: '🌲', descKey: 'jarabacoaDesc' },
        { name: 'Bayahíbe', icon: '🐠', descKey: 'bayahibeDesc' }
    ];

    return (
        <div className="relative z-[60]">
            {/* Trigger Button - Enhanced Design */}
            <div
                className="bg-white p-2 pl-6 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-center w-full max-w-xl mx-auto cursor-pointer transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] group border border-gray-100/50"
                onClick={() => setIsOpen(true)}
            >
                <div className="flex-1 flex items-center">
                    <span className="mr-3 text-lg">🔍</span>
                    <input
                        type="text"
                        placeholder={t('placeholderMain')}
                        className="w-full text-base md:text-lg outline-none text-gray-700 font-medium placeholder:text-gray-400 bg-transparent cursor-pointer"
                        readOnly
                        value={search}
                    />
                </div>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        router.push('/tours');
                    }}
                    className="bg-gray-900 text-white px-6 md:px-8 py-3 rounded-full font-bold text-sm hover:bg-black transition-all shadow-md flex items-center gap-2"
                >
                    <span className="hidden sm:inline">{t('searchBtn')}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                </button>
            </div>

            {/* Portal Overlay */}
            {mounted && isOpen && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-20 px-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm animate-in fade-in duration-200"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Modal Content */}
                    <div className="relative z-10 bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 duration-300 flex flex-col max-h-[85vh]">

                        {/* Header */}
                        <form onSubmit={handleSearch} className="p-4 border-b border-gray-100 flex items-center gap-4 shrink-0">
                            <span className="text-xl pl-2">🔍</span>
                            <input
                                autoFocus
                                type="text"
                                placeholder={t('placeholderModal')}
                                className="flex-1 text-lg outline-none text-gray-900 font-bold h-12 placeholder:font-normal placeholder:text-gray-400"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="w-10 h-10 flex items-center justify-center bg-gray-100 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded-full transition-colors font-bold"
                            >
                                ✕
                            </button>
                        </form>

                        {/* Scrollable Content */}
                        <div className="p-6 md:p-8 space-y-8 overflow-y-auto">
                            {/* Categories */}
                            <div>
                                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 ml-1">{t('exploreByCategory')}</h3>
                                <div className="flex flex-wrap gap-2.5">
                                    {categories.map(cat => (
                                        <button
                                            key={cat.key}
                                            onClick={() => {
                                                const label = t(`categories.${cat.key}` as any);
                                                setSearch(label);
                                                router.push(`/tours?search=${label}`);
                                                setIsOpen(false);
                                            }}
                                            className="px-4 py-2.5 bg-gray-50 hover:bg-primary hover:text-white rounded-xl transition-all text-sm font-bold border border-gray-100 hover:border-primary group"
                                        >
                                            {cat.icon} {t(`categories.${cat.key}` as any)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Popular Destinations */}
                            <div>
                                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 ml-1">{t('trendingDestinations')}</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {trendingDestinations.map(dest => (
                                        <button
                                            key={dest.name}
                                            onClick={() => { setSearch(dest.name); router.push(`/tours?search=${dest.name}`); setIsOpen(false); }}
                                            className="flex items-center gap-4 p-3 bg-white border border-gray-100 hover:border-primary/30 hover:shadow-lg rounded-2xl transition-all text-left group"
                                        >
                                            <span className="text-2xl bg-gray-50 w-12 h-12 flex items-center justify-center rounded-xl group-hover:bg-primary/10 group-hover:scale-110 transition-all">{dest.icon}</span>
                                            <div>
                                                <p className="font-bold text-gray-900 leading-tight group-hover:text-primary transition-colors">{dest.name}</p>
                                                <p className="text-[10px] text-gray-500 mt-1 font-medium">{t(`destinations.${dest.descKey}` as any)}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Footer / Search Action Mobile */}
                        <div className="p-4 border-t border-gray-100 md:hidden pb-safe">
                            <button onClick={handleSearch} className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 active:scale-95 transition-transform">
                                {t('viewResults')}
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
