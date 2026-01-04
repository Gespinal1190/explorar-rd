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
                <div className="flex flex-col h-full p-6 pt-24 overflow-y-auto">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center bg-gray-100 text-gray-900 rounded-full active:scale-95 transition-transform"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Links Container with Solid White for Max Readability */}
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 p-6 shadow-xl shadow-black/5">
                        <nav className="flex flex-col space-y-1">
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
                                    className="text-xl font-black text-gray-900 px-4 py-4 rounded-2xl active:bg-gray-50 transition-colors flex justify-between items-center group"
                                >
                                    {item.name}
                                    <span className="text-gray-400 group-hover:text-primary transition-colors">→</span>
                                </Link>
                            ))}
                        </nav>
                    </div>

                    <div className="mt-6 space-y-4">
                        {session?.user ? (
                            <div className="bg-white rounded-[2.5rem] border border-gray-100 p-6 shadow-xl shadow-black/5">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-14 h-14 bg-gradient-to-tr from-primary to-emerald-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg">
                                        {session.user.name?.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-black text-gray-900 text-lg leading-tight">{session.user.name}</p>
                                        <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mt-1">{session.user.role}</p>
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
                                        className="w-full py-4 bg-gray-900 text-white rounded-2xl text-center font-black text-sm shadow-xl active:scale-95 transition-transform"
                                    >
                                        Mi Panel de Control
                                    </Link>
                                    <SignOut />
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col space-y-3">
                                <Link
                                    href="/login"
                                    onClick={() => setIsOpen(false)}
                                    className="w-full py-5 text-center font-black text-gray-900 bg-white border border-gray-100 rounded-[2.5rem] shadow-xl shadow-black/5 active:scale-95 transition-transform"
                                >
                                    Iniciar Sesión
                                </Link>
                                <Link
                                    href="/agencies/register"
                                    onClick={() => setIsOpen(false)}
                                    className="w-full py-5 text-center font-black text-white bg-primary rounded-[2.5rem] shadow-xl shadow-primary/20 active:scale-95 transition-transform"
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
