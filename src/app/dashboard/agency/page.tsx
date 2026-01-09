import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AgencyDashboard() {
    const session = await auth();
    if (!session || session.user.role !== "AGENCY") {
        redirect("/dashboard");
    }

    const agency = await prisma.agencyProfile.findUnique({
        where: { userId: session.user.id },
        include: {
            tours: {
                include: {
                    bookings: true
                }
            }
        }
    });

    if (!agency) {
        return <div className="p-8">No se encontró perfil de agencia.</div>;
    }

    // Calculate Stats
    const totalTours = agency.tours.length;

    // Flatten bookings from all tours
    const allBookings = agency.tours.flatMap((tour: any) => tour.bookings);
    const confirmedBookings = allBookings.filter((b: any) => b.status === 'CONFIRMED');

    const totalBookings = confirmedBookings.length;
    // Calculate Revenue per Currency
    const revenueByCurrency = confirmedBookings.reduce((acc: Record<string, number>, b: any) => {
        const currency = b.currency || 'DOP'; // Default to DOP if missing
        acc[currency] = (acc[currency] || 0) + b.totalPrice;
        return acc;
    }, {});

    const revenueEntries = Object.entries(revenueByCurrency);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black text-gray-900">Panel de Control</h1>
                <p className="text-gray-500">Resumen de actividad de {agency.name}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Revenue Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-2xl flex-shrink-0">
                        💰
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-500 font-bold uppercase tracking-wide mb-1">Ingresos Totales</p>
                        {revenueEntries.length > 0 ? (
                            <div className="space-y-1">
                                {revenueEntries.map(([curr, amount]) => (
                                    <p key={curr} className="text-2xl font-black text-gray-900 truncate" title={`${curr} ${amount.toLocaleString()}`}>
                                        <span className="text-sm text-gray-400 font-bold mr-1">{curr}</span>
                                        {amount.toLocaleString()}
                                    </p>
                                ))}
                            </div>
                        ) : (
                            <p className="text-3xl font-black text-gray-900">RD$0</p>
                        )}
                    </div>
                </div>

                {/* Bookings Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl">
                        📅
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-bold uppercase tracking-wide">Reservas Confirmadas</p>
                        <p className="text-3xl font-black text-gray-900">{totalBookings}</p>
                    </div>
                </div>

                {/* Tours Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary text-2xl">
                        🏝️
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-bold uppercase tracking-wide">Tours Activos</p>
                        <p className="text-3xl font-black text-gray-900">{totalTours}</p>
                    </div>
                </div>
            </div>

            {/* Active Tours / Quick Actions */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Mis Anuncios</h2>
                        <p className="text-xs text-gray-500">Gestiona tus experiencias activas</p>
                    </div>
                    <Link href="/dashboard/agency/tours/new" className="w-full sm:w-auto px-4 py-3 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-all shadow-lg shadow-gray-900/10 flex items-center justify-center gap-2">
                        <span>✨</span> Publicar Nuevo
                    </Link>
                </div>

                {agency.tours.length > 0 ? (
                    <div className="space-y-4">
                        {agency.tours.slice(0, 3).map((tour: any) => (
                            <div key={tour.id} className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                                <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                    {tour.images?.[0] ? (
                                        <img src={tour.images[0].url} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">📷</div>
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h4 className="font-bold text-gray-900 truncate">{tour.title}</h4>
                                    <p className="text-xs text-gray-500 truncate">{tour.location} • {tour.currency} {tour.price}</p>
                                </div>
                                <div className={`w-2 h-2 rounded-full ${tour.status === 'PUBLISHED' ? 'bg-green-500' : 'bg-gray-300'}`} />
                            </div>
                        ))}
                        <Link href="/dashboard/agency/tours" className="block text-center text-sm font-bold text-primary hover:bg-primary/5 py-3 rounded-xl transition-colors border border-transparent hover:border-primary/20">
                            Ver todos los tours ({totalTours}) →
                        </Link>
                    </div>
                ) : (
                    <div className="text-center py-10 bg-gray-50 rounded-xl border-2 border-dashed border-gray-100 group hover:border-primary/30 transition-colors">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm text-2xl group-hover:scale-110 transition-transform">
                            🚀
                        </div>
                        <h3 className="text-sm font-bold text-gray-900">Está muy vacío por aquí</h3>
                        <p className="text-xs text-gray-500 mb-4 max-w-[200px] mx-auto">Publica tu primera excursión para empezar a recibir reservas.</p>
                        <Link href="/dashboard/agency/tours/new" className="text-primary font-bold text-xs hover:underline">
                            Crear Tour Ahora
                        </Link>
                    </div>
                )}
            </div>

            {/* Recent Activity / Chart Placeholder */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">📈 Rendimiento Mensual</h3>
                <div className="h-64 flex flex-col items-center justify-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 text-center p-6">
                    <span className="text-4xl mb-2 grayscale opacity-50">📊</span>
                    <h4 className="font-bold text-gray-400">Estadísticas Detalladas</h4>
                    <p className="text-sm text-gray-400 max-w-xs mt-1">Próximamente podrás ver la evolución de tus ventas, visitas y reservas mensuales.</p>
                </div>
            </div>
        </div>
    );
}

