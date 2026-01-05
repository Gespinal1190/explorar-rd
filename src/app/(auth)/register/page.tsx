"use client";

import RegisterForm from "@/components/ui/register-form";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Suspense } from 'react';

function RegisterContent() {
    const searchParams = useSearchParams();
    const role = searchParams.get('role') || 'USER';
    const isAgency = role === 'AGENCY';

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Image */}
            <div className="hidden lg:flex w-1/2 relative bg-gray-900">
                <Image
                    src="https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?q=80&w=2071&auto=format&fit=crop" // Different DR image
                    alt="Dominican Republic Nature"
                    fill
                    className="object-cover opacity-60 mix-blend-overlay"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="relative z-10 flex flex-col justify-end p-12 text-white">
                    <h2 className="text-4xl font-black mb-4 tracking-tighter">
                        {isAgency ? 'Potencia tu Agencia.' : 'Mochileros de corazón.'}
                    </h2>
                    <p className="text-lg opacity-90 max-w-md">
                        {isAgency
                            ? 'Únete a la red de turismo más grande del país y alcanza nuevos clientes.'
                            : 'Crea recuerdos inolvidables con las mejores experiencias locales.'}
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-[450px]">
                    <div className="text-center mb-10">
                        <Link href="/" className="inline-block mb-6">
                            <span className="text-4xl font-black text-gray-900 tracking-tighter">
                                Descubre<span className="text-primary">RD</span>
                            </span>
                        </Link>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            {isAgency ? 'Registra tu empresa' : 'Crea tu cuenta'}
                        </h1>
                        <p className="text-gray-500">Únete a nuestra comunidad hoy mismo.</p>
                    </div>

                    {/* Tab Switcher */}
                    <div className="flex bg-gray-50 p-1 rounded-2xl mb-8 border border-gray-100">
                        <Link href="/login" className="flex-1 py-3 text-sm font-bold text-gray-500 hover:text-gray-900 transition-all text-center flex items-center justify-center">
                            Iniciar Sesión
                        </Link>
                        <button className="flex-1 py-3 text-sm font-bold text-gray-900 bg-white shadow-sm rounded-xl transition-all">
                            Registrarse
                        </button>
                    </div>

                    <RegisterForm googleEnabled={!!(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET)} />
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
