import Link from "next/link";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Server Actions for quick toggles
async function toggleVerification(agencyId: string, currentStatus: boolean) {
    "use server";
    await prisma.agencyProfile.update({
        where: { id: agencyId },
        data: { isVerified: !currentStatus }
    });
    revalidatePath("/dashboard/admin/agencies");
}

export default async function AdminAgenciesPage(props: {
    searchParams?: Promise<{ search?: string; status?: string }>;
}) {
    const searchParams = await props.searchParams;
    const search = searchParams?.search || "";
    const statusFilter = searchParams?.status || "ALL";

    // Build Query
    const where: any = {};

    if (search) {
        where.OR = [
            { name: { contains: search, mode: "insensitive" } },
            { user: { email: { contains: search, mode: "insensitive" } } }
        ];
    }

    if (statusFilter === "VERIFIED") {
        where.isVerified = true;
    } else if (statusFilter === "PENDING") {
        where.isVerified = false;
    }

    // Fetch Data
    const agencies = await prisma.agencyProfile.findMany({
        where,
        include: {
            user: true,
            _count: {
                select: { tours: true }
            }
        },
        orderBy: { createdAt: "desc" }
    });

    // Stats
    const totalAgencies = await prisma.agencyProfile.count();
    const verifiedAgencies = await prisma.agencyProfile.count({ where: { isVerified: true } });
    const pendingAgencies = totalAgencies - verifiedAgencies;

    return (
        <div className="space-y-8">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl">
                        🏢
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">Total Agencias</p>
                        <p className="text-3xl font-black text-gray-900">{totalAgencies}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center text-2xl">
                        ✅
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">Verificadas</p>
                        <p className="text-3xl font-black text-gray-900">{verifiedAgencies}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl">
                        ⚠️
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">Pendientes</p>
                        <p className="text-3xl font-black text-gray-900">{pendingAgencies}</p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                {/* Toolbar */}
                <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900">Directorio de Agencias</h2>
                        <p className="text-gray-500 font-medium">Gestiona y verifica a los socios de la plataforma.</p>
                    </div>

                    <form className="flex w-full md:w-auto gap-3">
                        {/* Search */}
                        <div className="relative group">
                            <input
                                name="search"
                                defaultValue={search}
                                placeholder="Buscar agencia..."
                                className="pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl text-sm font-bold text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-primary/20 w-full md:w-64 transition-all group-hover:bg-gray-100"
                            />
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                        </div>

                        {/* Filter Button (Mock functionality for UI only in form submit) */}
                        <select
                            name="status"
                            defaultValue={statusFilter}
                            className="px-4 py-3 bg-gray-50 border-none rounded-xl text-sm font-bold text-gray-500 focus:ring-2 focus:ring-primary/20 cursor-pointer hover:bg-gray-100 transition-all"
                        >
                            <option value="ALL">Todos los estados</option>
                            <option value="VERIFIED">Verificadas</option>
                            <option value="PENDING">Pendientes</option>
                        </select>
                        <button type="submit" className="hidden">Buscar</button>
                    </form>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-8 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Agencia</th>
                                <th className="px-8 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Contacto</th>
                                <th className="px-8 py-5 text-center text-xs font-black text-gray-400 uppercase tracking-wider">Tours</th>
                                <th className="px-8 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Estado</th>
                                <th className="px-8 py-5 text-right text-xs font-black text-gray-400 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {agencies.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-12 text-center text-gray-500 font-medium">
                                        No se encontraron agencias que coincidan con tu búsqueda.
                                    </td>
                                </tr>
                            ) : (
                                agencies.map((agency) => (
                                    <tr key={agency.id} className="group hover:bg-gray-50/50 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center text-lg font-bold text-gray-400 shrink-0 overflow-hidden">
                                                    {agency.logo ? (
                                                        <img src={agency.logo} alt={agency.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        agency.name.charAt(0).toUpperCase()
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 group-hover:text-primary transition-colors">{agency.name}</p>
                                                    <p className="text-xs text-gray-400 font-medium">ID: {agency.id.slice(-6)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-sm font-medium text-gray-600 flex items-center gap-2">
                                                    📧 {agency.user.email}
                                                </span>
                                                {agency.phone && (
                                                    <span className="text-sm font-medium text-gray-400 flex items-center gap-2">
                                                        📞 {agency.phone}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600 font-black text-sm">
                                                {agency._count.tours}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            {agency.isVerified ? (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-green-100 text-green-700 border border-green-200">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                                    VERIFICADA
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-700 border border-amber-200">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                                    PENDIENTE
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                <form action={toggleVerification.bind(null, agency.id, agency.isVerified)}>
                                                    <button
                                                        title={agency.isVerified ? "Revocar verificación" : "Aprobar agencia"}
                                                        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${agency.isVerified ? 'bg-red-50 text-red-500 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}
                                                    >
                                                        {agency.isVerified ? '✕' : '✓'}
                                                    </button>
                                                </form>

                                                <Link
                                                    href={`/dashboard/admin/agencies/${agency.id}`}
                                                    className="w-9 h-9 rounded-xl bg-gray-100 text-gray-400 flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm"
                                                    title="Ver detalles completos"
                                                >
                                                    ➜
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer Pagination (Visual only for now) */}
                <div className="p-6 border-t border-gray-50 flex justify-center">
                    <p className="text-xs font-bold text-gray-300 uppercase tracking-widest">
                        Mostrando {agencies.length} resultados
                    </p>
                </div>
            </div>
        </div>
    );
}
