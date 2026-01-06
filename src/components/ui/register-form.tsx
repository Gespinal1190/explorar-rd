'use client';

import { useState } from 'react';
import { registerAction } from '@/lib/auth-actions';
import { useSearchParams } from 'next/navigation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

export default function RegisterForm() {
    const searchParams = useSearchParams();
    const role = searchParams.get('role') === 'agency' ? 'AGENCY' : 'USER';
    const { signInWithGoogle } = useAuth();

    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isPending, setIsPending] = useState(false);

    const handleGoogleRegister = async () => {
        // Google Register is same as Login, but we might want to capture role?
        // For now, simple Google Login. If they want to be Agency, they should use form or upgrade later.
        // Or we can intercept the loginAction to Update role? 
        // Let's just forward to standar Google Login for now.
        setIsPending(true);
        try {
            await signInWithGoogle();
        } catch (e) {
            setErrorMessage("Error al registrarse con Google");
        } finally {
            setIsPending(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsPending(true);
        setErrorMessage(null);

        const formData = new FormData(e.currentTarget);
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const role = formData.get('role') as string;

        try {
            // 1. Create Firebase User
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 2. Create DB User & Session
            const result = await registerAction(user.uid, email, name, role);
            if (result && result.error) {
                setErrorMessage(result.error);
            }
        } catch (error: any) {
            console.error(error);
            if (error.code === 'auth/email-already-in-use') {
                setErrorMessage("El correo ya está registrado.");
            } else {
                setErrorMessage("Error al crear cuenta: " + error.message);
            }
        } finally {
            setIsPending(false);
        }
    };

    return (
        <div className="space-y-6 w-full">
            {/* Google Register Button */}
            <button
                type="button"
                onClick={handleGoogleRegister}
                disabled={isPending}
                className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-100 p-3 rounded-xl hover:bg-gray-50 transition-all text-gray-700 font-bold disabled:opacity-50"
            >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26c.01-.19.01-.38.01-.58z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                {isPending ? 'Procesando...' : 'Regístrate con Google'}
            </button>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-100" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500 font-bold">O con correo</span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="hidden" name="role" value={role} />

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1" htmlFor="name">
                        {role === 'AGENCY' ? 'Nombre de la Agencia' : 'Nombre Completo'}
                    </label>
                    <input
                        className="w-full px-4 py-3 bg-gray-50 border-transparent focus:bg-white border-2 rounded-xl focus:ring-0 focus:border-primary outline-none transition-all font-medium"
                        id="name"
                        type="text"
                        name="name"
                        placeholder={role === 'AGENCY' ? 'Ej. Viajes Tropicales' : 'Tu Nombre'}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1" htmlFor="email">
                        Correo Electrónico
                    </label>
                    <input
                        className="w-full px-4 py-3 bg-gray-50 border-transparent focus:bg-white border-2 rounded-xl focus:ring-0 focus:border-primary outline-none transition-all font-medium"
                        id="email"
                        type="email"
                        name="email"
                        placeholder="tu@email.com"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1" htmlFor="password">
                        Contraseña
                    </label>
                    <input
                        className="w-full px-4 py-3 bg-gray-50 border-transparent focus:bg-white border-2 rounded-xl focus:ring-0 focus:border-primary outline-none transition-all font-medium"
                        id="password"
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        required
                        minLength={6}
                    />
                </div>

                <div
                    className="flex h-8 items-end space-x-1"
                    aria-live="polite"
                    aria-atomic="true"
                >
                    {errorMessage && (
                        <p className="text-red-500 text-sm font-medium bg-red-50 p-2 rounded-lg w-full text-center border border-red-100">
                            ⚠️ {errorMessage}
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-secondary text-white font-black py-4 rounded-xl hover:bg-emerald-600 transition-colors shadow-lg shadow-secondary/20 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {isPending ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Creando cuenta...
                        </>
                    ) : (
                        'Crear Cuenta'
                    )}
                </button>

                <div className="text-center mt-4 text-sm text-gray-600">
                    ¿Ya tienes cuenta? <a href="/login" className="text-primary hover:underline font-medium">Inicia Sesión</a>
                </div>
                {role !== 'AGENCY' && (
                    <div className="text-center mt-2 text-xs text-gray-500">
                        ¿Eres una agencia? <a href="/register?role=agency" className="text-secondary hover:underline font-bold">Regístrate aquí</a>
                    </div>
                )}
            </form>
        </div>
    );
}
