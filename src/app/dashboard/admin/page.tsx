import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

async function toggleVerification(agencyId: string, currentStatus: boolean | null) {
    "use server";
    await prisma.agencyProfile.update({
        where: { id: agencyId },
        data: { isVerified: !currentStatus }
    });
    revalidatePath("/dashboard/admin");
}

async function removeUser(userId: string) {
    "use server";
    await prisma.user.delete({ where: { id: userId } });
    revalidatePath("/dashboard/admin");
}

export default async function AdminDashboard() {
    const session = await auth();

    // Authorization Check
    if (!session || session.user.role !== "ADMIN") {
        return redirect("/dashboard");
    }

    // Fetch Data
    const stats = {
        users: await prisma.user.count({ where: { role: 'USER' } }),
        agencies: await prisma.agencyProfile.count(),
        bookings: await prisma.booking.count(),
        tours: await prisma.tour.count()
    };

    const agencies = await prisma.agencyProfile.findMany({
        include: { user: true, tours: true },
        orderBy: { createdAt: 'desc' }
    });

    const users = await prisma.user.findMany({
        where: { role: 'USER' },
        orderBy: { createdAt: 'desc' }
    });

    const bookings = await prisma.booking.findMany({
        include: { user: true, tour: true },
        orderBy: { createdAt: 'desc' }
    });

    // Calculate Total Sales
    const totalSales = await prisma.booking.aggregate({
        _sum: { totalPrice: true }
    });

    return (
        <div className="space-y-12">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-gray-900">Panel de Administración</h1>
                    <p className="text-gray-500">Vista general del rendimiento de la plataforma.</p>
                </div>
                <a href="/dashboard/admin/profile" className="px-4 py-2 bg-white text-gray-700 font-bold text-xs rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm">
                    ⚙️ Mi Configuración
                </a>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-primary to-teal-600 p-6 rounded-3xl text-white shadow-lg shadow-primary/20">
                    <div className="text-3xl mb-1">💰</div>
                    <div className="text-3xl font-black">RD${(totalSales._sum.totalPrice || 0).toLocaleString()}</div>
                    <div className="text-xs font-bold uppercase opacity-80">Ventas Totales</div>
                </div>
                {[
                    { label: "Usuarios", value: stats.users, icon: "👥" },
                    { label: "Agencias", value: stats.agencies, icon: "🏢" },
                    { label: "Reservas", value: stats.bookings, icon: "📅" },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl">{stat.icon}</span>
                            <span className="text-xs font-bold text-gray-400 uppercase">{stat.label}</span>
                        </div>
                        <div className="text-4xl font-black text-gray-900">{stat.value}</div>
                    </div>
                ))}
            </div>

            {/* Agency Management */}
            <section className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">🏢 Agencias Registradas</h3>
                        <p className="text-sm text-gray-500">Valida y gestiona los socios de la plataforma.</p>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-6 text-xs font-bold text-gray-500 uppercase">Agencia</th>
                                <th className="p-6 text-xs font-bold text-gray-500 uppercase">Estado</th>
                                <th className="p-6 text-xs font-bold text-gray-500 uppercase text-right">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {agencies.map((agency: any) => (
                                <tr key={agency.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-6">
                                        <div className="font-bold text-gray-900">{agency.name}</div>
                                        <div className="text-xs text-gray-500">{agency.user.email}</div>
                                    </td>
                                    <td className="p-6">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${agency.isVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {agency.isVerified ? 'Verificado' : 'Pendiente'}
                                        </span>
                                    </td>
                                    <td className="p-6 text-right">
                                        <div className="flex justify-end gap-2">
                                            <form action={toggleVerification.bind(null, agency.id, agency.isVerified)}>
                                                <button className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${agency.isVerified ? 'bg-orange-100 text-orange-600 hover:bg-orange-200' : 'bg-primary text-white hover:bg-primary-dark shadow-md shadow-primary/20'}`}>
                                                    {agency.isVerified ? 'Revocar' : 'Validar'}
                                                </button>
                                            </form>
                                            {!agency.isVerified && (
                                                <form action={removeUser.bind(null, agency.userId)}>
                                                    <button className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 w-full">
                                                        Rechazar
                                                    </button>
                                                </form>
                                            )}
                                            <Link href={`/dashboard/admin/agencies/${agency.id}`} className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 block text-center">
                                                Ver Detalles
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* User Management */}
            <section className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900">👥 Gestión de Usuarios</h3>
                    <p className="text-sm text-gray-500">Usuarios registrados en la plataforma.</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-6 text-xs font-bold text-gray-500 uppercase">Usuario</th>
                                <th className="p-6 text-xs font-bold text-gray-500 uppercase">Registro</th>
                                <th className="p-6 text-xs font-bold text-gray-500 uppercase text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {users.map((u: any) => (
                                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-6">
                                        <div className="font-bold text-gray-900">{u.name}</div>
                                        <div className="text-xs text-gray-500">{u.email}</div>
                                    </td>
                                    <td className="p-6 text-sm text-gray-500">
                                        {new Date(u.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-6 text-right">
                                        <form action={removeUser.bind(null, u.id)}>
                                            <button className="text-red-500 hover:text-red-700 font-bold text-xs bg-red-50 hover:bg-red-100 px-3 py-1 rounded-lg transition-colors">
                                                Eliminar
                                            </button>
                                        </form>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
            {/* Booking Management */}
            <section className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900">📅 Gestión de Reservas</h3>
                    <p className="text-sm text-gray-500">Historial completo de reservas.</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-6 text-xs font-bold text-gray-500 uppercase">Detalle</th>
                                <th className="p-6 text-xs font-bold text-gray-500 uppercase">Usuario</th>
                                <th className="p-6 text-xs font-bold text-gray-500 uppercase">Estado</th>
                                <th className="p-6 text-xs font-bold text-gray-500 uppercase">Pago</th>
                                <th className="p-6 text-xs font-bold text-gray-500 uppercase">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {bookings.map((booking: any) => (
                                <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-6">
                                        <div className="font-bold text-gray-900 text-sm">ID: {booking.id.slice(0, 8)}...</div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            {new Date(booking.date).toLocaleDateString()} · {booking.people} Pers.
                                        </div>
                                        <div className="text-xs font-bold text-primary mt-1">{booking.tour.title}</div>
                                    </td>
                                    <td className="p-6 text-sm text-gray-600">
                                        <div className="font-bold">{booking.user.name}</div>
                                        <div className="text-xs text-gray-400">{booking.user.email}</div>
                                    </td>
                                    <td className="p-6">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td className="p-6">
                                        <div className="text-xs font-bold uppercase text-gray-500 mb-1">{booking.paymentMethod}</div>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${booking.paymentStatus === 'PAID' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                                            {booking.paymentStatus}
                                        </span>
                                    </td>
                                    <td className="p-6 font-black text-gray-900">
                                        RD${booking.totalPrice.toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
