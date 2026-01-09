"use client";

import { useState } from 'react';
import Link from "next/link";
import Image from "next/image";
import { sendPasswordResetEmail, fetchSignInMethodsForEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isPending, setIsPending] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsPending(true);
        setErrorMessage(null);

        const emailToReset = email.trim();

        try {
            // Proceed directly to send reset email.
            // Note: If "Email Enumeration Protection" is enabled in Firebase Console, 
            // fetchSignInMethodsForEmail would return empty even for valid users.
            await sendPasswordResetEmail(auth, emailToReset);
            setIsSuccess(true);
        } catch (error: any) {
            console.error("Reset Password Error:", error);
            if (error.code === 'auth/user-not-found') {
                setErrorMessage("No encontramos una cuenta con este correo.");
            } else {
                setErrorMessage("Ocurrió un error: " + error.message);
            }
        } finally {
            setIsPending(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Image */}
            <div className="hidden lg:flex w-1/2 relative bg-gray-900">
                <Image
                    src="https://images.unsplash.com/photo-1544983058-290c04fdf6df?q=80&w=2070&auto=format&fit=crop"
                    alt="Dominican Republic Coast"
                    fill
                    className="object-cover opacity-60 mix-blend-overlay"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="relative z-10 flex flex-col justify-end p-12 text-white">
                    <h2 className="text-4xl font-black mb-4 tracking-tighter">Recupera tu acceso.</h2>
                    <p className="text-lg opacity-90 max-w-md">No te preocupes, te ayudaremos a volver a descubrir el paraíso.</p>
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
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">¿Olvidaste tu contraseña?</h1>
                        <p className="text-gray-500">Ingresa tu correo y te enviaremos las instrucciones.</p>
                    </div>

                    {!isSuccess ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1" htmlFor="email">
                                    Correo Electrónico
                                </label>
                                <input
                                    className="w-full px-4 py-3 bg-gray-50 border-transparent focus:bg-white border-2 rounded-xl focus:ring-0 focus:border-primary outline-none transition-all font-medium"
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="tu@email.com"
                                    required
                                />
                            </div>

                            <div aria-live="polite">
                                {errorMessage && (
                                    <p className="text-red-500 text-sm font-medium bg-red-50 p-2 rounded-lg w-full text-center border border-red-100">
                                        ⚠️ {errorMessage}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isPending}
                                className="w-full bg-primary text-white font-black py-4 rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isPending ? 'Enviando...' : 'Enviar instrucciones'}
                            </button>

                            <div className="text-center mt-6">
                                <Link href="/login" className="text-gray-500 font-bold hover:text-gray-900 transition-colors text-sm">
                                    ← Volver al inicio de sesión
                                </Link>
                            </div>
                        </form>
                    ) : (
                        <div className="bg-green-50 border border-green-100 rounded-2xl p-8 text-center animate-in fade-in zoom-in duration-300">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-3xl mx-auto mb-4">
                                ✉️
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">¡Correo enviado!</h3>
                            <p className="text-gray-600 mb-6">
                                Hemos enviado instrucciones a <strong>{email}</strong>. Revisa tu bandeja de entrada (y spam).
                            </p>
                            <Link href="/login" className="block w-full bg-white border-2 border-green-100 text-green-700 font-bold py-3 rounded-xl hover:bg-green-50 transition-all">
                                Volver al login
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
