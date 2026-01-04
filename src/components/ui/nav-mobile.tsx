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
                className={`fixed top-0 right-0 h-full w-[85%] max-w-sm bg-white/90 backdrop-blur-2xl z-50 shadow-2xl transform transition-transform duration-500 ease-out border-l border-white/20 ${isOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <div className="flex flex-col h-full p-8 pt-20">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="absolute top-6 right-6 p-2 text-gray-400"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <nav className="flex flex-col space-y-6">
                        <Link
                            href="/"
                            onClick={() => setIsOpen(false)}
                            className="text-xl font-bold text-gray-800 hover:text-primary"
                        >
                            Inicio
                        </Link>
                        <Link
                            href="/tours"
                            onClick={() => setIsOpen(false)}
                            className="text-xl font-bold text-gray-800 hover:text-primary"
                        >
                            Tours
                        </Link>
                        <Link
                            href="/destinos"
                            onClick={() => setIsOpen(false)}
                            className="text-xl font-bold text-gray-800 hover:text-primary"
                        >
                            Destinos
                        </Link>
                        <Link
                            href="/agencies"
                            onClick={() => setIsOpen(false)}
                            className="text-xl font-bold text-gray-800 hover:text-primary"
                        >
                            Agencias
                        </Link>
                    </nav>

                    <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col space-y-4">
                        {session?.user ? (
                            <>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                                        {session.user.name?.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">{session.user.name}</p>
                                        <p className="text-xs text-gray-500 uppercase">{session.user.role}</p>
                                    </div>
                                </div>
                                <Link
                                    href={
                                        session.user.role === 'ADMIN' ? '/dashboard/admin' :
                                            session.user.role === 'AGENCY' ? '/dashboard/agency' :
                                                '/dashboard/user'
                                    }
                                    onClick={() => setIsOpen(false)}
                                    className="w-full py-3 bg-gray-50 rounded-2xl text-center font-bold text-gray-800"
                                >
                                    Panel de Control
                                </Link>
                                <SignOut />
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    onClick={() => setIsOpen(false)}
                                    className="w-full py-4 text-center font-bold text-primary border-2 border-primary rounded-2xl"
                                >
                                    Iniciar Sesión
                                </Link>
                                <Link
                                    href="/agencies/register"
                                    onClick={() => setIsOpen(false)}
                                    className="w-full py-4 text-center font-bold text-white bg-gradient-to-r from-[#2DD4BF] to-[#0F766E] rounded-2xl shadow-lg shadow-teal-500/20"
                                >
                                    Registrar mi Agencia
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
