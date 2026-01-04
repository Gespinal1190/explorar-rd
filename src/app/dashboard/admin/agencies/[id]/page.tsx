import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { revalidatePath } from "next/cache";

async function toggleVerification(agencyId: string, currentStatus: boolean | null) {
    "use server";
    await prisma.agencyProfile.update({
        where: { id: agencyId },
        data: { isVerified: !currentStatus }
    });
    revalidatePath(`/dashboard/admin/agencies/${agencyId}`);
    revalidatePath("/dashboard/admin");
}

export default async function AgencyDetailsPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
        return redirect("/dashboard");
    }

    const agency = await prisma.agencyProfile.findUnique({
        where: { id: params.id },
        include: { user: true, tours: true }
    });

    if (!agency) {
        return <div className="p-8">Agencia no encontrada</div>;
    }

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-gray-900">{agency.name}</h1>
                    <div className="flex items-center gap-2 mt-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${agency.isVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {agency.isVerified ? 'Verificado' : 'Pendiente de Verificación'}
                        </span>
                        <span className="text-sm text-gray-500">• Registrado el {new Date(agency.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Link href="/dashboard/admin" className="px-4 py-2 bg-white text-gray-600 font-bold text-sm rounded-xl border hover:bg-gray-50">
                        Volver
                    </Link>
                    <form action={toggleVerification.bind(null, agency.id, agency.isVerified)}>
                        <button className={`px-6 py-2 rounded-xl text-sm font-bold shadow-lg transition-all ${agency.isVerified ? 'bg-orange-100 text-orange-700 hover:bg-orange-200' : 'bg-primary text-white hover:bg-emerald-600 shadow-primary/30'}`}>
                            {agency.isVerified ? 'Revocar Verificación' : 'Aprobar Agencia'}
                        </button>
                    </form>
                    {!agency.isVerified && (
                        <form action={async () => {
                            "use server";
                            await prisma.user.delete({ where: { id: agency.userId } });
                            redirect("/dashboard/admin");
                        }}>
                            <button className="px-6 py-2 rounded-xl text-sm font-bold bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 transition-colors">
                                Rechazar
                            </button>
                        </form>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Main Info */}
                <div className="md:col-span-2 space-y-8">
                    {/* General Information */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Información General</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase">Descripción</label>
                                <p className="text-gray-700 mt-1">{agency.description || "Sin descripción"}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase">Email Corporativo</label>
                                    <p className="font-medium text-gray-900">{agency.user.email}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase">Teléfono / WhatsApp</label>
                                    <p className="font-medium text-gray-900">{agency.phone || "N/A"}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase">Instagram</label>
                                    <p className="font-medium text-primary">
                                        {agency.instagram ? <a href={`https://instagram.com/${agency.instagram.replace('@', '')}`} target="_blank">{agency.instagram}</a> : "N/A"}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase">Sitio Web</label>
                                    <p className="font-medium text-primary">
                                        {agency.website ? <a href={agency.website} target="_blank">{agency.website}</a> : "N/A"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Verification Documents */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Documentos de Verificación</h2>
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">RNC / Registro Mercantil</label>
                                <div className="p-4 bg-gray-50 rounded-xl font-mono text-sm border border-gray-200">
                                    {agency.rnc || "No suministrado"}
                                </div>
                            </div>

                            {agency.licenseUrl && (
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Licencia de Operador</label>
                                    <a href={agency.licenseUrl} target="_blank" className="text-primary hover:underline font-medium break-all">
                                        {agency.licenseUrl}
                                    </a>
                                </div>
                            )}

                            {agency.premisesUrl && (
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Foto del Local / Equipo</label>
                                    <div className="relative h-64 w-full rounded-xl overflow-hidden border border-gray-100">
                                        <Image src={agency.premisesUrl} alt="Local" fill className="object-cover" />
                                    </div>
                                </div>
                            )}

                            {!agency.licenseUrl && !agency.premisesUrl && (
                                <p className="text-gray-500 italic text-sm">No se han subido documentos adicionales.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar Stats */}
                <div className="space-y-6">
                    <div className="bg-gray-900 p-6 rounded-3xl text-white">
                        <h3 className="text-lg font-bold mb-4">Estadísticas</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400 text-sm">Tours Publicados</span>
                                <span className="font-bold text-xl">{agency.tours.length}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400 text-sm">Ventas Confirmadas</span>
                                <span className="font-bold text-xl">-</span>
                            </div>
                            <div className="pt-4 border-t border-white/10">
                                <div className="text-center">
                                    <div className="text-xs text-gray-400 uppercase mb-1">ID de Usuario</div>
                                    <div className="font-mono text-xs text-gray-500 truncate">{agency.userId}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
