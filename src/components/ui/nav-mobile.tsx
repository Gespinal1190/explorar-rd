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

            {/* Sidebar Content */}
            <div
                className={`fixed top-0 right-0 h-full w-[85%] max-w-sm bg-white z-50 shadow-2xl transform transition-transform duration-500 ease-out border-l border-gray-100 ${isOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <div className="flex flex-col h-full p-8 pt-24 overflow-y-auto">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center bg-gray-50 text-gray-900 rounded-full"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <nav className="flex flex-col space-y-2">
                        {[
                            { name: 'Inicio', href: '/' },
                            { name: 'Tours', href: '/tours' },
                            { name: 'Destinos', href: '/destinos' },
                            { name: 'Agencias', href: '/agencies' }
                        ].map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className="text-2xl font-black text-black py-4 border-b border-gray-50 flex justify-between items-center"
                            >
                                {item.name}
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-gray-300">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                </svg>
                            </Link>
                        ))}
                    </nav>

                    <div className="mt-auto pb-10 space-y-4">
                        {session?.user ? (
                            <div className="pt-8 border-t border-gray-100">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center font-black text-xl shadow-lg">
                                        {session.user.name?.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-black text-black text-lg leading-tight">{session.user.name}</p>
                                        <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mt-1">{session.user.role}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <Link
                                        href={
                                            session.user.role === 'ADMIN' ? '/dashboard/admin' :
                                                session.user.role === 'AGENCY' ? '/dashboard/agency' :
                                                    '/dashboard/user'
                                        }
                                        onClick={() => setIsOpen(false)}
                                        className="w-full py-4 bg-gray-900 text-white rounded-2xl text-center font-black text-sm shadow-xl"
                                    >
                                        Mi Panel de Control
                                    </Link>
                                    <SignOut />
                                </div>
                            </div>
                        ) : (
                            <div className="pt-8 space-y-3">
                                <Link
                                    href="/login"
                                    onClick={() => setIsOpen(false)}
                                    className="w-full py-5 text-center font-black text-black bg-gray-50 rounded-2xl border border-gray-200"
                                >
                                    Iniciar Sesión
                                </Link>
                                <Link
                                    href="/agencies/register"
                                    onClick={() => setIsOpen(false)}
                                    className="w-full py-5 text-center font-black text-white bg-primary rounded-2xl shadow-xl shadow-primary/20"
                                >
                                    Registrar mi Agencia
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
