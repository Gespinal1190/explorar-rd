'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginForm() {
    const { signInWithGoogle, loginWithEmail } = useAuth();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isPending, setIsPending] = useState(false);

    const handleGoogleLogin = async () => {
        setIsPending(true);
        setErrorMessage(null);
        try {
            await signInWithGoogle();
        } catch (error: any) {
            setErrorMessage("Error al iniciar sesión con Google.");
        } finally {
            setIsPending(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsPending(true);
        setErrorMessage(null);
        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        const allowedDomains = ['gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com', 'icloud.com'];
        const emailDomain = email.split('@')[1]?.toLowerCase();

        if (!emailDomain || !allowedDomains.includes(emailDomain)) {
            // Exceptions for existing test accounts
            if (email !== 'agencia@test.com' && email !== 'admin@test.com') {
                setErrorMessage("Por seguridad, solo se permiten correos de proveedores principales (Gmail, Outlook, etc).");
                setIsPending(false);
                return;
            }
        }

        try {
            await loginWithEmail(email, password);
        } catch (error: any) {
            if (error.code === 'auth/invalid-credential') {
                setErrorMessage("Credenciales inválidas.");
            } else {
                setErrorMessage("Error al iniciar sesión.");
            }
        } finally {
            setIsPending(false);
        }
    };

    return (
        <div className="space-y-6 w-full">
            {/* Google Login Button */}
            <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isPending}
                className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-100 p-3 rounded-xl hover:bg-gray-50 transition-all text-gray-700 font-bold disabled:opacity-50"
            >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                    />
                    <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                    />
                    <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26c.01-.19.01-.38.01-.58z"
                        fill="#FBBC05"
                    />
                    <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                    />
                </svg>
                {isPending ? 'Conectando...' : 'Continuar con Google'}
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
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1" htmlFor="email">
                        Correo Electrónico
                    </label>
                    <input
                        className="w-full px-4 py-3 bg-gray-50 border-transparent focus:bg-white border-2 rounded-xl focus:ring-0 focus:border-primary outline-none transition-all font-medium"
                        id="email"
                        type="email"
                        name="email"
                        placeholder="ejemplo@gmail.com"
                        required
                    />
                </div>

                <div>
                    <div className="flex items-center justify-between mb-1">
                        <label className="block text-sm font-bold text-gray-700" htmlFor="password">
                            Contraseña
                        </label>
                        <a href="/forgot-password" className="text-xs font-bold text-primary hover:text-primary-dark transition-colors">
                            ¿Olvidaste tu contraseña?
                        </a>
                    </div>
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
                    className="w-full bg-primary text-white font-black py-4 rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
                >
                    {isPending ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Entrando...
                        </>
                    ) : (
                        'Iniciar Sesión'
                    )}
                </button>
            </form>
        </div>
    );
}
