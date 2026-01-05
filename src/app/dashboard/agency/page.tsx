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

            {/* Active Tours */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Mis Anuncios / Tours</h2>
                    <Link href="/dashboard/agency/tours/new" className="px-4 py-2 bg-primary text-white rounded-lg font-bold text-sm hover:bg-primary-dark transition-colors shadow-md shadow-primary/20">
                        + Publicar Nuevo
                    </Link>
                </div>
                <div className="space-y-4">
                    {/* Placeholder for list */}
                    <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <p className="text-gray-500 text-sm">Gestiona tus excursiones aquí.</p>
                        <Link href="/dashboard/agency/tours" className="text-primary font-bold text-sm mt-2 block hover:underline">
                            Ver Todos
                        </Link>
                    </div>
                </div>
            </div>

            {/* Recent Activity / Chart Placeholder */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">📈 Rendimiento Mensual</h3>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 text-gray-400 font-medium">
                    Gráfico de Ventas próximamente...
                </div>
            </div>
        </div>
    );
}

