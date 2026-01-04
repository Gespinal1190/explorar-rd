import Link from "next/link";
import { auth } from "@/lib/auth";
import { SignOut } from "@/components/ui/sign-out";

export default async function Navbar() {
    const session = await auth();

    return (
        <nav className="w-full bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
            <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-gray-900 tracking-tight">
                        Descubre<span className="text-primary">RD</span>
                    </span>
                </Link>

                {/* Center Links (Desktop) */}
                <div className="hidden md:flex items-center space-x-10">
                    <Link href="/" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
                        Inicio
                    </Link>
                    <Link href="/tours" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
                        Tours
                    </Link>
                    <Link href="/destinos" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
                        Destinos
                    </Link>
                    <Link href="/agencies" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
                        Agencias
                    </Link>
                </div>

                {/* Right Actions */}
                <div className="flex items-center space-x-4">
                    <button className="text-gray-500 hover:text-primary p-2">
                        {/* Search Icon Placeholder */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                    </button>

                    {session?.user ? (
                        <div className="flex items-center space-x-4">
                            {session.user.role === 'AGENCY' && (
                                <Link href="/dashboard/agency/profile" className="text-xs font-bold text-gray-700 hover:text-primary hidden md:block">
                                    📢 Mi Agencia
                                </Link>
                            )}
                            {session.user.role === 'USER' && (
                                <Link href="/dashboard/user/bookings" className="text-xs font-bold text-gray-700 hover:text-primary hidden md:block">
                                    ✈️ Mis Viajes
                                </Link>
                            )}

                            <div className="hidden md:block text-right">
                                <p className="text-xs font-semibold text-gray-900">{session.user.name}</p>
                                <p className="text-[10px] text-gray-500 uppercase">{session.user.role}</p>
                            </div>
                            <Link
                                href={
                                    session.user.role === 'ADMIN' ? '/dashboard/admin' :
                                        session.user.role === 'AGENCY' ? '/dashboard/agency' :
                                            '/dashboard/user'
                                }
                                className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold hover:bg-primary hover:text-white transition-all"
                            >
                                {session.user.name?.charAt(0)}
                            </Link>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-3">
                            <Link href="/login" className="hidden md:inline-flex px-5 py-2 rounded-full border border-primary text-primary text-sm font-semibold hover:bg-primary/5 transition-colors">
                                Iniciar Sesión
                            </Link>
                            <Link href="/agencies/register" className="px-5 py-2 rounded-full bg-gradient-to-r from-[#2DD4BF] to-[#0F766E] text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-md shadow-teal-500/20">
                                Soy Agencia
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
