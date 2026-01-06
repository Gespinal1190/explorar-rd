
import Navbar from "@/components/ui/navbar";
import prisma from "@/lib/prisma";
import { TourCard } from "@/components/tours/tour-card";
import { notFound } from "next/navigation";
import Image from "next/image";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const agency = await prisma.agencyProfile.findUnique({
        where: { id },
        select: { name: true }
    });
    if (!agency) return { title: 'Agencia no encontrada' };
    return { title: `${agency.name} | ExploraRD` };
}

export default async function AgencyProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const agency = await prisma.agencyProfile.findUnique({
        where: { id },
        include: {
            tours: {
                where: {
                    // Optionally filter active tours if you had a status field
                },
                include: {
                    images: true,
                    agency: true,
                    favorites: true,
                }
            },
            user: {
                select: { image: true, email: true }
            }
        }
    });

    if (!agency) {
        return notFound();
    }

    // Generate a consistent gradient based on agency ID specifically for the hero background
    const gradients = [
        "from-blue-600 via-purple-600 to-indigo-800",
        "from-emerald-500 via-teal-600 to-cyan-800",
        "from-orange-500 via-red-500 to-pink-600",
        "from-slate-800 via-gray-700 to-zinc-900"
    ];
    // Simple hash to pick a gradient
    const gradientIndex = id.charCodeAt(0) % gradients.length;
    const selectedGradient = gradients[gradientIndex];

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Navbar />

            {/* Hero Section */}
            <div className={`relative h-[350px] md:h-[450px] w-full bg-gradient-to-br ${selectedGradient} overflow-hidden`}>
                <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"></div>

                {/* Decorative Circles */}
                <div className="absolute top-10 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

                <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-24 md:pb-32 relative z-10">
                    <div className="flex flex-col md:flex-row items-end md:items-center gap-6 md:gap-8">

                        {/* Profile Image (Floating Glass Card) */}
                        <div className="relative group">
                            <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2rem] bg-white/80 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/50 p-2 transform translate-y-12 md:translate-y-16 transition-transform duration-300 hover:scale-105 flex items-center justify-center overflow-hidden">
                                {agency.logo ? (
                                    <img
                                        src={agency.logo}
                                        alt={agency.name}
                                        className="w-full h-full object-cover rounded-[1.5rem]"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-100 rounded-[1.5rem] flex items-center justify-center text-4xl font-bold text-gray-400">
                                        {agency.name.charAt(0)}
                                    </div>
                                )}
                            </div>
                            {agency.isVerified && (
                                <div className="absolute -bottom-[-40px] -right-2 bg-blue-500 text-white p-2 md:p-2.5 rounded-full shadow-lg border-4 border-white transform translate-y-14 md:translate-y-16" title="Agencia Verificada">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 md:w-6 md:h-6">
                                        <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            )}
                        </div>

                        {/* Agency Name & Stats */}
                        <div className="text-white transform translate-y-12 md:translate-y-6 text-center md:text-left flex-1">
                            <h1 className="text-4xl md:text-5xl font-black tracking-tight drop-shadow-lg mb-2">{agency.name}</h1>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm md:text-base font-medium opacity-90">
                                <span className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">
                                    Active desde {new Date(agency.createdAt).getFullYear()}
                                </span>
                                <span className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">
                                    📍 5.0 (Reseñas)
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="container mx-auto px-4 pt-24 pb-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Left Sidebar: Info & Contact */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* About Card */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 sticky top-28">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Sobre Nosotros</h2>
                            <p className="text-gray-600 leading-relaxed mb-6">
                                {agency.description || "Esta agencia aún no ha agregado una descripción, pero seguro tienen aventuras increíbles planeadas para ti."}
                            </p>

                            <div className="space-y-4">
                                {agency.whatsapp && (
                                    <a href={`https://wa.me/${agency.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-colors shadow-lg shadow-green-500/30">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" /></svg>
                                        Contactar por WhatsApp
                                    </a>
                                )}

                                {agency.instagram && (
                                    <a href={agency.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-3 bg-white text-gray-800 border border-gray-200 rounded-xl font-bold hover:bg-gray-50 transition-colors">
                                        📸 Instagram
                                    </a>
                                )}

                                {agency.website && (
                                    <a href={agency.website} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-3 bg-white text-gray-800 border border-gray-200 rounded-xl font-bold hover:bg-gray-50 transition-colors">
                                        🌐 Sitio Web
                                    </a>
                                )}

                                <div className="pt-6 border-t border-gray-100 flex items-center gap-2 text-gray-500 text-sm justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                                    </svg>
                                    Miembro Verificado
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Content: Active Tours */}
                    <div className="lg:col-span-8">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-black text-gray-900">
                                Próximas Excursiones
                                <span className="ml-3 text-lg font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{agency.tours.length}</span>
                            </h2>
                        </div>

                        {agency.tours.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {agency.tours.map((tour: any) => (
                                    <TourCard
                                        key={tour.id}
                                        id={tour.id}
                                        title={tour.title}
                                        price={tour.price}
                                        location={tour.location}
                                        image={tour.images[0]?.url}
                                        agencyName={agency.name}
                                        isAgencyPro={agency.isVerified}
                                        currency={tour.currency}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-4xl">🏝️</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Sin excursiones activas</h3>
                                <p className="text-gray-500 max-w-sm mx-auto">
                                    Esta agencia no tiene excursiones publicadas en este momento. Vuelve a revisar pronto.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
