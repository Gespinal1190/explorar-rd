import Navbar from "@/components/ui/navbar";
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function AgenciesPage() {
    const agencies = await prisma.agencyProfile.findMany({
        where: { isVerified: true },
        include: { tours: true },
        orderBy: [
            { tier: 'desc' },
            { name: 'asc' }
        ] as any
    });

    return (
        <div className="min-h-screen bg-[#FBFBF8]">
            <Navbar />
            <div className="container mx-auto px-4 py-12">
                <header className="text-center mb-16 space-y-4">
                    <span className="text-primary font-bold text-xs uppercase tracking-widest border border-primary/20 px-3 py-1 rounded-full bg-primary/5">Socios Confiables</span>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">Nuestras Agencias</h1>
                    <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                        Conecta directamente con los operadores locales más destacados de República Dominicana.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {agencies.map((agency: any) => (
                        <div key={agency.id} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all group">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-2xl border border-gray-100 group-hover:scale-110 transition-transform">
                                    {agency.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl text-gray-900">{agency.name}</h3>
                                    <span className="text-xs text-green-600 font-bold flex items-center gap-1">
                                        🛡️ Verificada
                                    </span>
                                </div>
                            </div>

                            <p className="text-gray-500 text-sm mb-6 line-clamp-3">
                                {agency.description || "Agencia dedicada a ofrecer las mejores experiencias locales."}
                            </p>

                            <div className="flex justify-between items-center border-t border-gray-50 pt-6">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                    {agency.tours.length} Excursiones
                                </span>
                                <Link href={`/agencies/${agency.id}`} className="text-primary font-bold text-sm hover:underline">
                                    Ver Perfil →
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {agencies.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                        <p className="text-gray-400 font-medium">Aún no hay agencias públicas verificadas.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
