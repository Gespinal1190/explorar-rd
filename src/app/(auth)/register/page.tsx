"use client";

import RegisterForm from "@/components/ui/register-form";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from 'react';

function RegisterContent() {
    const searchParams = useSearchParams();
    const role = searchParams.get('role') || 'USER';
    const isAgency = role === 'AGENCY';

    return (
        <div className="min-h-screen bg-[#FBFBF8] flex flex-col justify-center py-12 px-6">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
                <Link href="/" className="text-3xl font-black text-gray-900 tracking-tight">
                    Descubre<span className="text-primary">RD</span>
                </Link>
                <h2 className="mt-4 text-xl font-bold text-gray-900">
                    {isAgency ? 'Registra tu Agencia' : 'Crea tu Cuenta'}
                </h2>
                <p className="text-gray-500 mt-2">
                    {isAgency ? 'Únete a la mejor plataforma de turismo interno.' : 'Empieza a descubrir el paraíso hoy mismo.'}
                </p>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-[400px]">
                <div className="bg-white py-10 px-8 shadow-xl rounded-2xl border border-gray-100">
                    {/* Tab Switcher Visual Placeholder */}
                    <div className="flex bg-gray-50 p-1 rounded-xl mb-8">
                        <Link href="/login" className="flex-1 py-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-all text-center">
                            Iniciar Sesión
                        </Link>
                        <button className="flex-1 py-2 text-sm font-bold text-gray-900 bg-white shadow-sm rounded-lg transition-all">
                            Registrarse
                        </button>
                    </div>

                    <RegisterForm />
                </div>
            </div>
        </div>
    );
}

export default function RegisterPage() {
    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <RegisterContent />
        </Suspense>
    )
}
