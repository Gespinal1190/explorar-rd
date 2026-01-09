import Link from "next/link";
import prisma from "@/lib/prisma";
import { moderateTour } from "@/actions/admin-tours";

export default async function AdminToursPage(props: {
    searchParams?: Promise<{ search?: string; status?: string }>;
}) {
    const searchParams = await props.searchParams;
    const search = searchParams?.search || "";
    const statusFilter = searchParams?.status || "ALL";

    // Build Query
    const where: any = {};

    if (search) {
        where.OR = [
            { title: { contains: search, mode: "insensitive" } },
            { location: { contains: search, mode: "insensitive" } },
            { agency: { name: { contains: search, mode: "insensitive" } } }
        ];
    }

    if (statusFilter !== "ALL") {
        where.status = statusFilter;
    }

    // Fetch Tours
    const tours = await prisma.tour.findMany({
        where,
        include: {
            agency: true,
            images: true
        },
        orderBy: { createdAt: "desc" }
    });

    const totalTours = await prisma.tour.count();

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-gray-900">Moderación de Anuncios</h1>
                    <p className="text-gray-500">Revisa y gestiona todo el contenido publicado en la plataforma.</p>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                {/* Toolbar */}
                <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Listado Global</h2>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                            {tours.length} Anuncios encontrados
                        </span>
                    </div>

                    <form className="flex w-full md:w-auto gap-3">
                        <div className="relative group">
                            <input
                                name="search"
                                defaultValue={search}
                                placeholder="Buscar tour, destino o agencia..."
                                className="pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl text-sm font-bold text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-primary/20 w-full md:w-80 transition-all group-hover:bg-gray-100"
                            />
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                        </div>

                        <select
                            name="status"
                            defaultValue={statusFilter}
                            className="px-4 py-3 bg-gray-50 border-none rounded-xl text-sm font-bold text-gray-500 focus:ring-2 focus:ring-primary/20 cursor-pointer hover:bg-gray-100 transition-all"
                        >
                            <option value="ALL">Todos los estados</option>
                            <option value="PUBLISHED">Publicados</option>
                            <option value="PAUSED">Pausados</option>
                            <option value="DRAFT">Borradores</option>
                        </select>
                        <button type="submit" className="hidden">Filtrar</button>
                    </form>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-8 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Tour / Destino</th>
                                <th className="px-8 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Agencia</th>
                                <th className="px-8 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Precio</th>
                                <th className="px-8 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Estado</th>
                                <th className="px-8 py-5 text-right text-xs font-black text-gray-400 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {tours.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-16 text-center text-gray-500">
                                        No se encontraron tours.
                                    </td>
                                </tr>
                            ) : (
                                tours.map((tour) => (
                                    <tr key={tour.id} className="group hover:bg-gray-50/50 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-12 rounded-lg bg-gray-200 overflow-hidden shrink-0">
                                                    {tour.images && tour.images.length > 0 ? (
                                                        <img src={tour.images[0].url} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">Sin foto</div>
                                                    )}
                                                </div>
                                                <div className="min-w-0 max-w-xs">
                                                    <p className="font-bold text-gray-900 truncate group-hover:text-primary transition-colors">{tour.title}</p>
                                                    <p className="text-xs text-gray-500 font-medium">📍 {tour.location}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            {tour.agency ? (
                                                <Link href={`/dashboard/admin/agencies/${tour.agencyId}`} className="flex items-center gap-2 hover:underline">
                                                    <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold shrink-0">
                                                        {(tour.agency.name || 'A').charAt(0)}
                                                    </div>
                                                    <span className="text-sm font-bold text-gray-700 truncate max-w-[150px]">{tour.agency.name || 'Agencia Desconocida'}</span>
                                                </Link>
                                            ) : (
                                                <span className="text-gray-400 text-sm">Agencia no encontrada</span>
                                            )}
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-sm font-black text-gray-900">
                                                {tour.currency === 'USD' ? 'US$' : 'RD$'} {(tour.price || 0).toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black border ${tour.status === 'PUBLISHED'
                                                    ? 'bg-green-100 text-green-700 border-green-200'
                                                    : tour.status === 'PAUSED'
                                                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                                                        : 'bg-gray-100 text-gray-500 border-gray-200'
                                                }`}>
                                                {tour.status === 'PUBLISHED' ? '🟢 ONLINE' : tour.status === 'PAUSED' ? '⏸️ PAUSADO' : '⚪ BORRADOR'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/tours/${tour.id}`}
                                                    target="_blank"
                                                    className="p-2 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/5 transition-colors"
                                                    title="Ver anuncio real"
                                                >
                                                    👁️
                                                </Link>

                                                <form action={async () => {
                                                    "use server";
                                                    await moderateTour(tour.id, 'DELETE');
                                                }}>
                                                    <button
                                                        type="submit"
                                                        className="p-2 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                                        title="ELIMINAR Definitivamente"
                                                    >
                                                        🗑️
                                                    </button>
                                                </form>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
