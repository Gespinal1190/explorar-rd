"use client";

import { useState } from "react";
import { Link } from "@/navigation";
import { useTranslations } from "next-intl";
import { DRPaths, DR_SOLID_BG } from "@/components/destinations/dr-map-paths";

export function InteractiveMap() {
    const t = useTranslations("Destinations");

    const destinations = [
        {
            id: "punta-cana",
            name: "Punta Cana",
            description: t('map.puntaCana'),
            image: "/images/destinations/punta-cana.jpg",
            x: 755,
            y: 280,
            tours: "45+ Tours"
        },
        {
            id: "samana",
            name: "Samaná",
            description: t('map.samana'),
            image: "/images/destinations/samana.jpg",
            x: 550,
            y: 200,
            tours: "28+ Tours"
        },
        {
            id: "jarabacoa",
            name: "Jarabacoa",
            description: t('map.jarabacoa'),
            image: "/images/destinations/jarabacoa.jpg",
            x: 350,
            y: 230,
            tours: "20+ Tours"
        },
        {
            id: "santo-domingo",
            name: "Santo Domingo",
            description: t('map.santoDomingo'),
            image: "/images/destinations/santo-domingo.jpg",
            x: 450,
            y: 345,
            tours: "15+ Tours"
        },
        {
            id: "puerto-plata",
            name: "Puerto Plata",
            description: t('map.puertoPlata'),
            image: "/images/destinations/puerto-plata.jpg",
            x: 280,
            y: 55,
            tours: "22+ Tours"
        },
        {
            id: "bayahibe",
            name: "Bayahíbe",
            description: t('map.bayahibe'),
            image: "/images/destinations/bayahibe.jpg",
            x: 620,
            y: 350,
            tours: "30+ Tours"
        },
        {
            id: "bahia-aguilas",
            name: "Bahía de las Águilas",
            description: t('map.bahiaAguilas'),
            image: "/images/destinations/bahia-aguilas.jpg",
            x: 55,
            y: 440,
            tours: "10+ Tours"
        }
    ];

    const [activeDest, setActiveDest] = useState(destinations[0]);
    const currentActive = destinations.find(d => d.id === activeDest.id) || destinations[0];

    return (
        <section className="py-12 md:py-16">
            {/* Header / Intro - Updated Title & Desc */}
            <div className="text-center mb-10 md:mb-14 px-4 hidden md:block">
                <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-xs font-bold mb-3 uppercase tracking-wider">
                    {t('exploreZone')}
                </span>
                <h3 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
                    {t('map.mapTitle')}
                </h3>
                <p className="text-gray-500 max-w-2xl mx-auto text-base md:text-lg font-medium">
                    {t('map.mapLocationDesc')}
                </p>
            </div>

            {/* Mobile Header */}
            <div className="block md:hidden px-4 mb-6">
                <h3 className="text-2xl font-black text-gray-900 mb-2">{t('map.mapTitle')}</h3>
                <p className="text-sm text-gray-500">{t('map.mapLocationDesc')}</p>
            </div>

            {/* Main Layout Container - Vertical Stack */}
            <div className="flex flex-col gap-12">

                {/* 1. Map Container - Full Width */}
                <div className="relative bg-[#eefcfc] rounded-[2.5rem] border border-primary/10 p-4 md:p-8 h-[400px] md:h-[500px] lg:h-[650px] flex items-center justify-center group shadow-xl">

                    {/* Background Decoration */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2 pointer-events-none" />

                    {/* SVG DR MAP - High Quality Paths (Full 34 Provinces) */}
                    <svg viewBox="0 0 800 544" className="w-full h-full drop-shadow-xl transition-all duration-700 hover:scale-[1.01]">
                        <g>
                            {/* Province Details */}
                            {DRPaths.map((province, idx) => (
                                <path
                                    key={idx}
                                    d={province.d}
                                    fill="#fff"
                                    stroke="#2DD4BF"
                                    strokeWidth="1"
                                    className="hover:fill-teal-50 transition-colors duration-300"
                                />
                            ))}
                        </g>

                        {/* Pulsing Effect for Active */}
                        {destinations.map((dest) => (
                            <g key={dest.id} className="cursor-pointer" onClick={() => {
                                setActiveDest(dest);
                                document.getElementById(`card-${dest.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }}>
                                {currentActive?.id === dest.id && (
                                    <circle cx={dest.x} cy={dest.y} r="25" fill="#2DD4BF" className="animate-ping opacity-20" />
                                )}
                                <circle
                                    cx={dest.x}
                                    cy={dest.y}
                                    r={currentActive?.id === dest.id ? "12" : "8"}
                                    fill={currentActive?.id === dest.id ? "#0F766E" : "#2DD4BF"}
                                    className="transition-all duration-300 hover:scale-150 shadow-lg"
                                    stroke="white"
                                    strokeWidth="2"
                                />
                                <text
                                    x={dest.x}
                                    y={dest.y - 20}
                                    textAnchor="middle"
                                    className={`text-[14px] font-black select-none pointer-events-none transition-opacity duration-300 ${currentActive?.id === dest.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'}`}
                                    fill="#0F766E"
                                >
                                    {dest.name}
                                </text>
                            </g>
                        ))}
                    </svg>

                    {/* Legend Helper */}
                    <div className="absolute bottom-8 left-8 bg-white/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-widest shadow-sm">
                        {t('map.clickToExplore')}
                    </div>
                </div>

                {/* 2. Cards Grid - Below Map */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-2">
                    {destinations.map((dest) => {
                        const isActive = currentActive?.id === dest.id;
                        return (
                            <div
                                id={`card-${dest.id}`}
                                key={dest.id}
                                onClick={() => setActiveDest(dest)}
                                className={`group relative bg-white rounded-[2rem] overflow-hidden border transition-all duration-300 cursor-pointer flex flex-col
                                    ${isActive
                                        ? 'border-primary ring-4 ring-primary/10 shadow-xl scale-[1.02]'
                                        : 'border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1'
                                    }`}
                            >
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={dest.image}
                                        alt={dest.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <div className="absolute bottom-4 left-4">
                                        <h3 className="text-xl font-black text-white">{dest.name}</h3>
                                        <p className="text-xs font-bold text-white/90 uppercase tracking-wider">{dest.tours}</p>
                                    </div>
                                </div>
                                <div className="p-6 flex flex-col flex-1">
                                    <p className="text-sm text-gray-600 font-medium line-clamp-3 mb-4">{dest.description}</p>

                                    <Link
                                        href={`/tours?search=${dest.name}`}
                                        className={`mt-auto block w-full text-center py-3 rounded-xl font-bold text-sm transition-all
                                            ${isActive
                                                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                                : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
                                            }`}
                                    >
                                        {t('map.viewToursZone')}
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}
