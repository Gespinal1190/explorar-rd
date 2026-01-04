"use client";

import { useState } from "react";
import Link from "next/link";
import { SignOut } from "./sign-out";

interface NavMobileProps {
    session: any;
}

export function NavMobile({ session }: NavMobileProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="md:hidden">
            {/* Hamburger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-gray-600 hover:text-primary transition-colors focus:outline-none"
                aria-label="Toggle menu"
            >
                {isOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                )}
            </button>

            {/* Mobile Sidebar Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm transition-opacity"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Content (Drawer) */}
            <div
                className={`fixed inset-0 h-screen w-full bg-white/80 backdrop-blur-2xl z-50 transform transition-transform duration-500 ease-in-out ${isOpen ? "translate-y-0" : "-translate-y-full"
                    }`}
            >
                <div className="flex flex-col h-full p-6 pt-20">
                    {/* Header with Logo and Close Button */}
                    <div className="flex items-center justify-between mb-12">
                        <div className="w-10 h-10 bg-[#06B6D4] rounded-full flex items-center justify-center text-white shadow-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                            </svg>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="bg-gray-100/50 p-2 rounded-full text-gray-900"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex flex-col space-y-2 mb-10">
                        <Link
                            href="/"
                            onClick={() => setIsOpen(false)}
                            className="text-2xl font-semibold text-[#14B8A6] bg-[#14B8A6]/10 px-6 py-4 rounded-2xl"
                        >
                            Inicio
                        </Link>
                        {[
                            { name: 'Tours', href: '/tours' },
                            { name: 'Destinos', href: '/destinos' },
                            { name: 'Agencias', href: '/agencies' }
                        ].map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className="text-2xl font-semibold text-gray-600 px-6 py-4"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Action Buttons */}
                    <div className="mt-auto pb-10 space-y-4">
                        {session?.user ? (
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 p-4 bg-white/50 rounded-2xl border border-white/20">
                                    <div className="w-12 h-12 bg-[#14B8A6] text-white rounded-full flex items-center justify-center font-bold text-xl">
                                        {session.user.name?.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-gray-900 truncate">{session.user.name}</p>
                                        <p className="text-xs text-gray-500 uppercase tracking-widest">{session.user.role}</p>
                                    </div>
                                </div>
                                <Link
                                    href={
                                        session.user.role === 'ADMIN' ? '/dashboard/admin' :
                                            session.user.role === 'AGENCY' ? '/dashboard/agency' :
                                                '/dashboard/user'
                                    }
                                    onClick={() => setIsOpen(false)}
                                    className="block w-full py-4 bg-gray-900 text-white rounded-2xl text-center font-bold shadow-xl"
                                >
                                    Panel de Control
                                </Link>
                                <SignOut />
                            </div>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center justify-center gap-2 w-full py-4 bg-transparent text-[#14B8A6] font-semibold rounded-2xl border-2 border-[#14B8A6]"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                    </svg>
                                    Iniciar Sesión
                                </Link>
                                <Link
                                    href="/agencies/register"
                                    onClick={() => setIsOpen(false)}
                                    className="block w-full py-4 bg-[#14B8A6] text-white rounded-2xl text-center font-bold shadow-lg shadow-[#14B8A6]/30"
                                >
                                    Soy Agencia
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
