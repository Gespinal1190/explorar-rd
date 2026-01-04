"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function SearchOverlay() {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (search.trim()) {
            router.push(`/tours?search=${encodeURIComponent(search)}`);
            setIsOpen(false);
        }
    };

    return (
        <div className="relative z-50">
            {/* Trigger Button - Enhanced Design */}
            {/* Trigger Button - Enhanced Design */}
            <div
                className="bg-white p-2 pl-6 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-center w-full max-w-xl mx-auto cursor-pointer transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] group"
                onClick={() => setIsOpen(true)}
            >
                <div className="flex-1 flex items-center">
                    <input
                        type="text"
                        placeholder="¿A dónde quieres ir?"
                        className="w-full text-lg outline-none text-gray-700 font-medium placeholder:text-gray-400 bg-transparent cursor-pointer"
                        readOnly
                        value={search}
                    />
                </div>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        // If empty, just open toggle, but if button says "Buscar Tours" might imply direct link?
                        // User said: "Buscar Tours debe llevar al area de tours"
                        router.push('/tours');
                    }}
                    className="bg-gradient-to-r from-[#2DD4BF] to-[#0F766E] text-white px-8 py-3 rounded-full font-bold text-sm hover:opacity-90 transition-all shadow-md hover:shadow-lg flex items-center gap-2 transform group-hover:scale-105"
                >
                    <span className="hidden sm:inline">Buscar Tours</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                </button>
            </div>

            {/* Overlay */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-32 px-4 transition-all animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
                        <form onSubmit={handleSearch} className="p-4 border-b border-gray-100 flex items-center gap-4">
                            <span className="text-gray-400 pl-2">🔍</span>
                            <input
                                autoFocus
                                type="text"
                                placeholder="Busca por zona, agencia o actividad..."
                                className="flex-1 text-lg outline-none text-gray-900 font-medium h-12"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                ✕
                            </button>
                        </form>

                        <div className="p-8 space-y-8">
                            {/* Categories */}
                            <div>
                                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 ml-1">¿Qué te apetece hoy?</h3>
                                <div className="flex flex-wrap gap-2.5">
                                    {['🏖️ Playas', '⛰️ Montaña', '🏎️ Buggies', '⛵ Catamarán', '🎭 Cultural'].map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => { setSearch(cat.split(' ')[1]); router.push(`/tours?search=${cat.split(' ')[1]}`); setIsOpen(false); }}
                                            className="px-5 py-3 bg-gray-50 active:bg-primary/20 hover:bg-primary/10 hover:text-primary rounded-2xl transition-all text-sm font-bold border border-transparent hover:border-primary/20"
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Popular Destinations */}
                            <div>
                                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 ml-1">Destinos Top</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {[
                                        { name: 'Punta Cana', icon: '🌴', desc: 'Sol, playa y arena' },
                                        { name: 'Samaná', icon: '🐋', desc: 'Naturaleza salvaje' },
                                        { name: 'Jarabacoa', icon: '🌲', desc: 'El corazón de la montaña' },
                                        { name: 'Bayahíbe', icon: '🐠', desc: 'Buceo y relax' }
                                    ].map(dest => (
                                        <button
                                            key={dest.name}
                                            onClick={() => { setSearch(dest.name); router.push(`/tours?search=${dest.name}`); setIsOpen(false); }}
                                            className="flex items-center gap-4 p-4 bg-gray-50 active:bg-white active:shadow-lg hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 rounded-[1.5rem] transition-all text-left border border-transparent hover:border-gray-100 group"
                                        >
                                            <span className="text-2xl bg-white w-12 h-12 flex items-center justify-center rounded-2xl shadow-sm group-hover:scale-110 transition-transform">{dest.icon}</span>
                                            <div>
                                                <p className="font-bold text-gray-900 leading-none">{dest.name}</p>
                                                <p className="text-[11px] text-gray-500 mt-1.5">{dest.desc}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Background click to close */}
                    <div className="absolute inset-0 -z-10" onClick={() => setIsOpen(false)} />
                </div>
            )}
        </div>
    );
}
