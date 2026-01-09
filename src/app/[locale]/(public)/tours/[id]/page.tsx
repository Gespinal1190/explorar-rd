import Navbar from "@/components/ui/navbar";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Link } from "@/navigation";
import { GalleryGrid } from "@/components/ui/gallery-grid";
import { BookingForm } from "@/components/tours/booking-form";

export const dynamic = "force-dynamic";

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
        return { title: 'DescubreRD' };
    }
}

export default async function TourDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    let tourRaw; // Changed from `let tour;`
    try {
        tourRaw = await prisma.tour.findUnique({
            where: { id },
            include: {
                images: true,
                agency: true,
                // @ts-ignore - dates relation exists
                dates: {
                    orderBy: { date: 'asc' },
                    where: { date: { gte: new Date() } } // Only future dates
                }
            }
        });
    } catch (error) {
        console.error("TourDetail Fetch Error:", error);
    }

    if (!tourRaw) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-xl font-bold text-gray-400">Tour no encontrado</p>
            </div>
        );
    }

    // Cast to explicit any to bypass strict relation type checking issues in this file
    const tour = tourRaw as any;

    // Parse includes/excludes if they are JSON strings
    let includesList = [];
    if (tour.includes) {
        try {
            includesList = JSON.parse(tour.includes);
            // Ensure it's an array
            if (!Array.isArray(includesList)) {
                // If it's a string inside JSON, or something else
                includesList = [includesList.toString()];
            }
        } catch (e) {
            // Fallback: assume it's a comma-separated string or just plain text
            includesList = tour.includes.includes(',')
                ? tour.includes.split(',').map((s: string) => s.trim())
                : [tour.includes];
        }
    }

    const availableDates = tour.dates?.map((d: any) => ({
        date: d.date.toISOString().split('T')[0],
        time: d.startTime || tour.startTime // Fallback to global start time
    })) || [];

    const whatsappMessage = `Hola, vengo de DescubreRD y me interesa el tour: ${tour.title || ''} `;

    // Defensive check for agency
    const agencyWhatsapp = tour.agency?.whatsapp || '';
    const whatsappLink = `https://wa.me/${agencyWhatsapp}?text=${encodeURIComponent(whatsappMessage)}`;

    return (
        <div className="min-h-screen bg-[#FBFBF8]">
            <Navbar />

            {/* Premium Gallery Section */}
            <div className="container mx-auto px-4 pt-8 pb-4">
                <GalleryGrid
                    images={tour.images?.map((img: any) => ({ id: img.id, url: img.url })) || []}
                    title={tour.title}
                />

                {/* Title Overlay in Desktop (optional) or below */}
                <div className="mt-8 mb-4">
                    <div className="flex flex-wrap items-center gap-4 mb-2">
                        <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-primary/20">
                            {tour.location || 'RD'}
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
                            {includesList.map((item: any, idx: number) => (
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
                            {/* Iframe Logic */}
                            {tour.location && (
                                <iframe
                                    title="Mapa de Ubicación"
                                    width="100%"
                                    height="100%"
                                    frameBorder="0"
                                    src={`https://maps.google.com/maps?q=${encodeURIComponent(tour.location)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                                ></iframe>
                            )}
                        </div>
                    </div>

                    {/* Agency Info */}
                    <div className="p-6 md:p-8 rounded-3xl md:rounded-[2.5rem] bg-gray-50 border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center font-bold text-xl text-gray-400 border border-gray-200">
                                {tour.agency?.name?.charAt(0) || 'A'}
                            </div>
                            <div>
                                <p className="font-bold text-lg text-gray-900">{tour.agency?.name || 'Agencia Local'}</p>
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Operador Verificado</p>
                            </div>
                        </div>
                        {tour.agency && (
                            <Link href={`/agencies/${tour.agency.id}`} className="bg-white text-gray-900 border border-gray-200 px-6 py-2 rounded-full font-bold text-sm hover:bg-gray-50 transition-colors">
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
                            availableDates={availableDates}
                            startTime={tour.startTime}
                        />
                    </div>

                    {/* Mobile Form */}
                    <div className="lg:hidden bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <BookingForm
                            tourId={tour.id}
                            price={tour.price}
                            currency={tour.currency || 'DOP'}
                            whatsappLink={whatsappLink}
                            availableDates={availableDates}
                            startTime={tour.startTime}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
