"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOut } from "@/components/ui/sign-out";
import {
    HomeIcon,
    CalendarIcon,
    UserIcon,
    ShieldCheckIcon,
    CurrencyDollarIcon,
    HeartIcon,
    MapIcon,
    BuildingStorefrontIcon,
    XMarkIcon
} from "@heroicons/react/24/outline";

interface DashboardSidebarProps {
    userRole: string;
    userName?: string | null;
    closeMenu?: () => void; // Optional prop to close mobile menu on click
}

export function DashboardSidebar({ userRole, userName, closeMenu }: DashboardSidebarProps) {
    const pathname = usePathname();
    const isAgency = userRole === 'AGENCY';
    const isAdmin = userRole === 'ADMIN';

    // Helper to check active link
    const isActive = (path: string) => pathname === path;
    const linkClass = (path: string) => `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${isActive(path)
        ? 'bg-primary/10 text-primary font-bold'
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        }`;

    const handleClick = () => {
        if (closeMenu) closeMenu();
    };

    return (
        <div className="flex flex-col h-full bg-white border-r border-gray-100">
            {/* Logo Area (Desktop only usually, but kept for structure) */}
            <div className="p-6 h-20 flex items-center justify-between border-b border-gray-100">
                <Link href="/" className="flex items-center gap-2" onClick={handleClick}>
                    <span className="text-xl font-black text-gray-900 tracking-tight">
                        Explorar<span className="text-primary">RD</span>
                    </span>
                    <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-bold">PANEL</span>
                </Link>

                {/* Mobile Close Button */}
                {closeMenu && (
                    <button
                        onClick={closeMenu}
                        className="p-2 -mr-2 text-gray-400 hover:text-gray-900 md:hidden"
                    >
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                )}
            </div>

            <nav className="flex-1 overflow-y-auto p-4 space-y-8">
                {/* General Section */}
                <div className="space-y-2">
                    <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">General</p>
                    <Link href="/dashboard" className={linkClass('/dashboard')} onClick={handleClick}>
                        <HomeIcon className="w-5 h-5" />
                        Resumen
                    </Link>
                </div>

                {/* Agency Links */}
                {isAgency && (
                    <div className="space-y-2">
                        <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Agencia</p>
                        <Link href="/dashboard/agency/tours" className={linkClass('/dashboard/agency/tours')} onClick={handleClick}>
                            <MapIcon className="w-5 h-5" />
                            Mis Tours
                        </Link>
                        <Link href="/dashboard/agency/bookings" className={linkClass('/dashboard/agency/bookings')} onClick={handleClick}>
                            <CalendarIcon className="w-5 h-5" />
                            Reservas
                        </Link>
                        <Link href="/dashboard/agency/profile" className={linkClass('/dashboard/agency/profile')} onClick={handleClick}>
                            <BuildingStorefrontIcon className="w-5 h-5" />
                            Perfil Agencia
                        </Link>
                        <Link href="/dashboard/agency/membership" className={`${linkClass('/dashboard/agency/membership')} text-primary`} onClick={handleClick}>
                            <ShieldCheckIcon className="w-5 h-5" />
                            Membresía PRO
                        </Link>
                    </div>
                )}

                {/* Admin Links */}
                {isAdmin && (
                    <div className="space-y-2">
                        <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Administración</p>
                        <Link href="/dashboard/admin/agencies" className={linkClass('/dashboard/admin/agencies')} onClick={handleClick}>
                            <BuildingStorefrontIcon className="w-5 h-5" />
                            Agencias
                        </Link>
                        <Link href="/dashboard/admin/bookings" className={linkClass('/dashboard/admin/bookings')} onClick={handleClick}>
                            <CalendarIcon className="w-5 h-5" />
                            Gestión Reservas
                        </Link>
                        <Link href="/dashboard/admin/settings" className={linkClass('/dashboard/admin/settings')} onClick={handleClick}>
                            <CurrencyDollarIcon className="w-5 h-5" />
                            Configuración
                        </Link>
                    </div>
                )}

                {/* User Links */}
                {!isAgency && !isAdmin && (
                    <div className="space-y-2">
                        <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Viajero</p>
                        <Link href="/dashboard/user/bookings" className={linkClass('/dashboard/user/bookings')} onClick={handleClick}>
                            <CalendarIcon className="w-5 h-5" />
                            Mis Reservas
                        </Link>
                        <Link href="/dashboard/user/favorites" className={linkClass('/dashboard/user/favorites')} onClick={handleClick}>
                            <HeartIcon className="w-5 h-5" />
                            Favoritos
                        </Link>
                    </div>
                )}
            </nav>

            {/* Footer / User Profile */}
            <div className="p-4 border-t border-gray-100">
                <div className="bg-gray-50 rounded-2xl p-4 mb-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-primary font-bold text-lg">
                        {userName?.charAt(0) || 'U'}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-bold text-gray-900 truncate">{userName}</p>
                        <p className="text-[10px] text-gray-500 uppercase font-black">{userRole}</p>
                    </div>
                </div>
                <SignOut />
            </div>
        </div>
    );
}
