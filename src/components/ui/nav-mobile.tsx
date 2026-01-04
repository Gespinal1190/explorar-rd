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

            {/* Sidebar Content (Full Screen, No Scroll) */}
            <div
                className={`fixed inset-0 h-screen w-full bg-white z-50 transform transition-transform duration-500 ease-in-out overflow-hidden ${isOpen ? "translate-y-0" : "-translate-y-full"
                    }`}
            >
                <div className="flex flex-col h-full p-8 pt-20">
                    {/* Header with Close Button */}
                    <div className="flex justify-end mb-16">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="w-12 h-12 flex items-center justify-center bg-gray-50 text-[#0047AB] rounded-full active:scale-90 transition-transform"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Navigation Links (Passion Blue & Pure Black) */}
                    <nav className="flex flex-col space-y-4">
                        <Link
                            href="/"
                            onClick={() => setIsOpen(false)}
                            className="text-4xl font-black text-[#0047AB] tracking-tighter"
                        >
                            INICIO
                        </Link>
                        {[
                            { name: 'TOURS', href: '/tours' },
                            { name: 'DESTINOS', href: '/destinos' },
                            { name: 'AGENCIAS', href: '/agencies' }
                        ].map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className="text-4xl font-black text-black tracking-tighter hover:text-[#0047AB] transition-colors"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Action Buttons (Passion Blue Style) */}
                    <div className="mt-auto pb-16 space-y-4">
                        {session?.user ? (
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 py-4 border-b border-gray-100">
                                    <div className="w-12 h-12 bg-[#0047AB] text-white rounded-full flex items-center justify-center font-black text-xl">
                                        {session.user.name?.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-black text-black text-lg leading-tight uppercase">{session.user.name}</p>
                                        <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold">{session.user.role}</p>
                                    </div>
                                </div>
                                <Link
                                    href={
                                        session.user.role === 'ADMIN' ? '/dashboard/admin' :
                                            session.user.role === 'AGENCY' ? '/dashboard/agency' :
                                                '/dashboard/user'
                                    }
                                    onClick={() => setIsOpen(false)}
                                    className="block w-full py-5 bg-black text-white rounded-2xl text-center font-black text-sm tracking-widest uppercase"
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
                                    className="block w-full py-5 text-[#0047AB] font-black text-center text-sm border-2 border-[#0047AB] rounded-2xl tracking-widest uppercase"
                                >
                                    Iniciar Sesión
                                </Link>
                                <Link
                                    href="/agencies/register"
                                    onClick={() => setIsOpen(false)}
                                    className="block w-full py-5 bg-[#0047AB] text-white rounded-2xl text-center font-black text-sm shadow-xl shadow-[#0047AB]/20 tracking-widest uppercase"
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
