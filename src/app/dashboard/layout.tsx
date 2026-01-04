import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SignOut } from "@/components/ui/sign-out";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const session = await auth();
    if (!session) redirect('/login');

    const isAgency = session.user.role === 'AGENCY';
    const isAdmin = session.user.role === 'ADMIN';

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r hidden md:block flex-shrink-0">
                <div className="p-6 h-16 flex items-center border-b">
                    <Link href="/" className="text-xl font-bold text-primary tracking-tight">Explorar RD</Link>
                </div>

                <nav className="p-4 space-y-2">
                    <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase">Menú</div>

                    <Link href="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium">
                        Resumen
                    </Link>

                    {isAgency && (
                        <>
                            <Link href="/dashboard/agency/tours" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium">
                                Mis Tours
                            </Link>
                            <Link href="/dashboard/agency/bookings" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium">
                                Reservas
                            </Link>
                            <Link href="/dashboard/agency/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium">
                                Perfil Agencia
                            </Link>
                            <Link href="/dashboard/agency/membership" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-bold text-primary">
                                Membresía PRO 💎
                            </Link>
                        </>
                    )}

                    {isAdmin && (
                        <>
                            <Link href="/dashboard/admin/agencies" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium">
                                Agencias
                            </Link>
                            <Link href="/dashboard/admin/bookings" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium">
                                Gestión de Reservas
                            </Link>
                            <Link href="/dashboard/admin/settings" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium">
                                Configuración y Precios ⚙️
                            </Link>
                        </>
                    )}

                    {!isAgency && !isAdmin && (
                        <>
                            <Link href="/dashboard/user/bookings" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium">
                                Mis Reservas
                            </Link>
                            <Link href="/dashboard/user/favorites" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium">
                                Favoritos
                            </Link>
                        </>
                    )}

                    <div className="mt-8 border-t pt-4">
                        <div className="px-4 mb-2">
                            <p className="text-sm font-bold text-gray-900">{session.user.name}</p>
                            <p className="text-xs text-gray-500 capitalize">{session.user.role.toLowerCase()}</p>
                        </div>
                        <div className="px-4">
                            <SignOut />
                        </div>
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                <header className="h-16 bg-white border-b flex items-center justify-between px-6 md:hidden">
                    <span className="font-bold text-primary">Explorar RD</span>
                    {/* Mobile menu toggle would go here */}
                </header>
                <main className="flex-1 overflow-auto p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
