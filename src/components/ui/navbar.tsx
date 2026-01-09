import { Link } from "@/navigation";
import { auth } from "@/lib/auth";
import { SignOut } from "@/components/ui/sign-out";
import { NavMobile } from "./nav-mobile";
import { Logo } from "./logo";
import { getTranslations } from "next-intl/server";

import LanguageSwitcher from "./language-switcher";

export default async function Navbar() {
    const session = await auth();
    const t = await getTranslations("Navbar");

    return (
        <nav className="w-full bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
            <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <Logo className="h-12 w-auto" />
                </Link>

                {/* Center Links (Desktop) */}
                <div className="hidden lg:flex items-center space-x-10">
                    <Link href="/" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
                        {t('home')}
                    </Link>
                    <Link href="/tours" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
                        {t('tours')}
                    </Link>
                    <Link href="/destinos" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
                        {t('destinations')}
                    </Link>
                    <Link href="/agencies" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
                        {t('agencies')}
                    </Link>
                </div>

                {/* Right Actions */}
                <div className="flex items-center space-x-2 md:space-x-4">
                    <LanguageSwitcher />

                    {session?.user ? (
                        <div className="flex items-center space-x-3 md:space-x-6">
                            {/* Role-Specific Links */}
                            {session.user.role === 'AGENCY' && (
                                <Link href="/dashboard/agency" className="text-sm font-bold text-gray-700 hover:text-primary hidden lg:flex items-center gap-2">
                                    <span>📊</span> Panel de Agencia
                                </Link>
                            )}

                            {session.user.role === 'ADMIN' && (
                                <Link href="/dashboard/admin" className="text-sm font-bold text-gray-700 hover:text-primary hidden lg:flex items-center gap-2">
                                    <span>🛡️</span> Administración
                                </Link>
                            )}

                            {session.user.role === 'USER' && (
                                <Link href="/dashboard/user/bookings" className="text-sm font-bold text-gray-700 hover:text-primary hidden lg:flex items-center gap-2">
                                    <span>✈️</span> Mis Viajes
                                </Link>
                            )}

                            {/* Use Separator */}
                            <div className="hidden lg:block w-px h-6 bg-gray-200"></div>

                            {/* User Profile */}
                            <div className="flex items-center gap-3">
                                <div className="hidden lg:block text-right leading-tight">
                                    <p className="text-sm font-bold text-gray-900">{session.user.name?.split(' ')[0]}</p>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{session.user.role === 'AGENCY' ? 'Partner' : session.user.role === 'ADMIN' ? 'Staff' : 'Viajero'}</p>
                                </div>
                                <Link
                                    href={
                                        session.user.role === 'ADMIN' ? '/dashboard/admin' :
                                            session.user.role === 'AGENCY' ? '/dashboard/agency' :
                                                '/dashboard/user'
                                    }
                                    className="hidden sm:flex w-10 h-10 bg-gray-100 rounded-full items-center justify-center text-gray-600 font-bold hover:bg-primary hover:text-white transition-all overflow-hidden border border-gray-200"
                                >
                                    {session.user.image ? (
                                        <img src={session.user.image} alt={session.user.name || ""} className="w-full h-full object-cover" />
                                    ) : (
                                        session.user.name?.charAt(0)
                                    )}
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="hidden md:flex items-center space-x-3">
                            <Link href="/login" className="px-5 py-2.5 rounded-xl font-bold text-gray-600 hover:text-primary hover:bg-primary/5 transition-colors text-sm">
                                {t('login')}
                            </Link>
                            <Link href="/agencies/register" className="px-5 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-bold hover:bg-black transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2">
                                <span>💼</span>
                                {t('iAmAgency')}
                            </Link>
                        </div>
                    )}

                    {/* Mobile Menu Toggle (Hamburger) */}
                    <NavMobile session={session} />
                </div>
            </div>
        </nav>
    );
}
