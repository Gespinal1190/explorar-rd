import Navbar from "@/components/ui/navbar";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { GalleryGrid } from "@/components/ui/gallery-grid";
import { BookingForm } from "@/components/tours/booking-form";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const tour = await prisma.tour.findUnique({
            where: { id },
            select: { title: true }
        });
        if (!tour) return { title: 'Tour no encontrado' };
        return { title: `${tour.title} | DescubreRD` };
    } catch (e) {
        console.error("Metadata error:", e);
        return { title: 'Explorar RD' };
    }
}

export default async function TourDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    let tour;
    try {
        tour = await prisma.tour.findUnique({
            where: { id },
            include: {
                images: true,
                agency: true // Removed nested user include to prevent serialization issues
            }
        });
    } catch (error) {
        console.error("TourDetail Fetch Error:", error);
    }

    if (!tour) {
        notFound();
    }

    // Parse includes/excludes if they are JSON strings
    let includesList: string[] = [];
    try {
        if (tour.includes) includesList = JSON.parse(tour.includes);
    } catch (e) {
        includesList = [tour.includes || ''];
    }

    const whatsappMessage = `Hola, vengo de DescubreRD y me interesa el tour: ${tour.title || ''} `;
    const whatsappLink = `https://wa.me/${tour.agency?.whatsapp || ''}?text=${encodeURIComponent(whatsappMessage)}`;

    // Cast latitude/longitude from DB (fields added in recent schema update)
    const lat = (tour as any)?.latitude;
    const lng = (tour as any)?.longitude;

    return (
        <div className="min-h-screen bg-[#FBFBF8]">
            <Navbar />

            {/* Premium Gallery Section */}
            <div className="container mx-auto px-4 pt-8 pb-4">
                <GalleryGrid
                    images={tour.images?.map(img => ({ id: img.id, url: img.url })) || []}
                    title={tour.title}
                />

                {/* Title Overlay in Desktop (optional) or below */}
                <div className="mt-8 mb-4">
                    <div className="flex flex-wrap items-center gap-4 mb-2">
                        <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-primary/20">
                            {tour.location}
                        </span>
                        <div className="flex items-center gap-1 text-yellow-500 font-bold text-sm">
                            ⭐️ 4.9 (12 Reseñas)
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">{tour.title}</h1>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-12">

                    {/* Description Tab */}
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            📝 Sobre esta experiencia
                        </h3>
                        <div className="prose prose-lg text-gray-600 leading-relaxed whitespace-pre-line">
                            {tour.description}
                        </div>
                    </div>

                    {/* Includes Tab */}
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            ✨ ¿Qué incluye?
                        </h3>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {includesList.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                    <span className="text-green-500 font-bold bg-green-50 p-1 rounded-full">✓</span>
                                    <span className="text-gray-700 font-medium">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Location Map */}
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            🗺️ Ubicación
                        </h3>
                        <div className="bg-gray-100 rounded-3xl overflow-hidden h-80 shadow-sm border border-gray-200">
                            <iframe
                                title="Mapa de Ubicación"
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                src={`https://maps.google.com/maps?q=${encodeURIComponent((tour as any).requirements || tour.location || "Dominican Republic")}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                            ></iframe>
                        </div>
                        <p className="text-sm text-gray-500 mt-3 flex items-center gap-2">
                            📍 {(tour as any).requirements || tour.location}
                        </p>
                    </div>

                    {/* Instagram Integration - Placeholder/Mock as requested in Phase 3 */}
                    {(tour as any).instagramUrl && (
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                📸 Experiencia en Instagram
                            </h3>
                            <div className="bg-white p-2 rounded-2xl border border-gray-100 shadow-sm max-w-md hover:shadow-md transition-shadow">
                                <Link href={(tour as any).instagramUrl} target="_blank" className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors group">
                                    <div className="w-12 h-12 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-inner">
                                        <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.163 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 text-sm">Ver Publicación Original</p>
                                        <p className="text-xs text-gray-500">Abrir en Instagram</p>
                                    </div>
                                    <div className="ml-auto text-gray-300 group-hover:text-primary transition-colors">
                                        ↗
                                    </div>
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Agency Info */}
                    <div className={`p-6 md:p-8 rounded-3xl md:rounded-[2.5rem] flex flex-col md:flex-row md:items-center justify-between gap-6 border transition-all ${tour.agency && (tour.agency as any).tier === 'PRO' ? 'bg-gradient-to-br from-teal-50 to-blue-50 border-teal-100 shadow-sm' : 'bg-gray-50 border-gray-100'}`}>
                        <div className="flex items-center gap-4 md:gap-5">
                            <div className={`w-16 h-16 md:w-20 md:h-20 shadow-lg rounded-2xl md:rounded-3xl flex items-center justify-center font-black text-2xl md:text-3xl border ${tour.agency && (tour.agency as any).tier === 'PRO' ? 'bg-white text-teal-600 border-white' : 'bg-white text-gray-400 border-gray-100'}`}>
                                {tour.agency?.name ? tour.agency.name.substring(0, 1).toUpperCase() : 'A'}
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`text-[9px] md:text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${tour.agency && (tour.agency as any).tier === 'PRO' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                                        {tour.agency && (tour.agency as any).tier === 'PRO' ? 'Socio Verificado 🏆' : 'Agencia Local'}
                                    </span>
                                </div>
                                <p className="font-black text-gray-900 text-xl md:text-2xl tracking-tight">{tour.agency?.name || 'Agencia de Tours'}</p>
                                {tour.agency && (tour.agency as any).tier === 'PRO' && (
                                    <p className="text-teal-600 text-[10px] md:text-xs font-bold mt-1">
                                        🛡️ Miembro Premium de Explorar RD
                                    </p>
                                )}
                            </div>
                        </div>
                        {tour.agency && (
                            <Link href={`/agencies/${tour.agency.id}`} className={`w-full md:w-auto text-center px-8 py-3 font-bold rounded-2xl md:rounded-full transition-all shadow-sm hover:shadow-md ${(tour.agency as any).tier === 'PRO' ? 'bg-teal-600 text-white hover:bg-teal-700' : 'bg-white text-gray-900 border border-gray-200 hover:bg-gray-50'}`}>
                                Ver Perfil
                            </Link>
                        )}
                    </div>
                </div>

                {/* Sidebar Actions */}
                <div className="lg:col-span-1">
                    <div className="hidden lg:block bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 sticky top-28">
                        <div className="mb-8 pb-8 border-b border-gray-100">
                            <span className="text-sm text-gray-400 font-bold uppercase tracking-wide">Precio Total</span>
                            <div className="flex items-end gap-1 mt-2">
                                <span className="text-5xl font-black text-gray-900 tracking-tight">
                                    {tour.currency === 'USD' ? 'USD$' : tour.currency === 'EUR' ? '€' : 'RD$'}
                                    {tour.price.toLocaleString()}
                                </span>
                                <span className="text-gray-400 font-medium mb-2">/ persona</span>
                            </div>
                        </div>

                        <BookingForm
                            tourId={tour.id}
                            price={tour.price}
                            currency={tour.currency || 'DOP'}
                            whatsappLink={whatsappLink}
                        />
                    </div>

                    {/* Mobile Only: Inline Booking Form (Alternative to Floating Bar or complement) */}
                    <div className="lg:hidden bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <BookingForm
                            tourId={tour.id}
                            price={tour.price}
                            currency={tour.currency || 'DOP'}
                            whatsappLink={whatsappLink}
                        />
                    </div>
                </div>
            </div>

            {/* Mobile Sticky Footer CTA */}
            <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-gray-100 p-4 z-50 flex items-center justify-between animate-in slide-in-from-bottom-full duration-500">
                <div>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Reserva desde</p>
                    <p className="text-2xl font-black text-gray-900">
                        {tour.currency === 'USD' ? '$' : tour.currency === 'EUR' ? '€' : 'RD$'}
                        {tour.price.toLocaleString()}
                    </p>
                </div>
                <Link
                    href="#booking-section"
                    className="bg-primary text-white px-8 py-3.5 rounded-2xl font-black text-sm shadow-lg shadow-primary/30 active:scale-95 transition-transform"
                    onClick={(e) => {
                        e.preventDefault();
                        document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                >
                    Reservar Ahora
                </Link>
            </div>

            {/* Anchor for mobile scroll */}
            <div id="booking-section" className="lg:hidden h-20" />
        </div>
    );
}
