"use client";

import { useState } from "react";
import { DashboardSidebar } from "./dashboard-sidebar";

interface DashboardMobileNavProps {
    userRole: string;
    userName?: string | null;
}

export function DashboardMobileNav({ userRole, userName }: DashboardMobileNavProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Mobile Header Bar */}
            <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-100 sticky top-0 z-30">
                <span className="font-black text-lg text-gray-900 tracking-tight">
                    Explorar<span className="text-primary">RD</span>
                </span>

                <button
                    onClick={() => setIsOpen(true)}
                    className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                </button>
            </div>

            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm animate-in fade-in duration-200 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Drawer */}
            <div className={`fixed inset-y-0 left-0 w-[80%] max-w-xs bg-white z-50 transform transition-transform duration-300 ease-in-out md:hidden shadow-2xl ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <DashboardSidebar
                    userRole={userRole}
                    userName={userName}
                    closeMenu={() => setIsOpen(false)}
                />

                {/* Close Button Absolute */}
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-[-3rem] p-2 bg-white rounded-full shadow-lg text-gray-900 md:hidden"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </>
    );
}
