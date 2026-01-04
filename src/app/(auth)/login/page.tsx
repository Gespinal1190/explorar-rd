"use client";

import LoginForm from "@/components/ui/login-form";
import Link from "next/link";

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-[#FBFBF8] flex flex-col justify-center py-12 px-6">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
                <Link href="/" className="text-3xl font-black text-gray-900 tracking-tight">
                    Descubre<span className="text-primary">RD</span>
                </Link>
                <h2 className="mt-4 text-xl font-bold text-gray-900">Bienvenido de vuelta</h2>
                <p className="text-gray-500 mt-2">Ingresa a tu cuenta para gestionar tus reservas.</p>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-[400px]">
                <div className="bg-white py-10 px-8 shadow-xl rounded-2xl border border-gray-100">
                    {/* Tab Switcher Visual Placeholder */}
                    <div className="flex bg-gray-50 p-1 rounded-xl mb-8">
                        <button className="flex-1 py-2 text-sm font-bold text-gray-900 bg-white shadow-sm rounded-lg transition-all">
                            Iniciar Sesión
                        </button>
                        <Link href="/register" className="flex-1 py-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-all text-center">
                            Registrarse
                        </Link>
                    </div>

                    <LoginForm />
                </div>
            </div>
        </div>
    );
}
