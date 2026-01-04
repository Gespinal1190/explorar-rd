'use client';

import { useActionState } from 'react';
import { authenticate } from '@/lib/actions';

export default function LoginForm() {
    const [errorMessage, formAction, isPending] = useActionState(
        authenticate,
        undefined
    );

    return (
        <form action={formAction} className="space-y-4 w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
            <h1 className="text-2xl font-bold text-center text-primary mb-6">Iniciar Sesión</h1>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                    Correo Electrónico
                </label>
                <input
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    id="email"
                    type="email"
                    name="email"
                    placeholder="tu@email.com"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
                    Contraseña
                </label>
                <input
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    id="password"
                    type="password"
                    name="password"
                    placeholder="******"
                    required
                    minLength={6}
                />
            </div>

            <div className="flex items-center justify-between text-sm">
                <label className="flex items-center text-gray-600">
                    {/* Checkbox skipped for now */}
                </label>
                <a href="#" className="text-primary hover:underline">¿Olvidaste tu contraseña?</a>
            </div>

            <div
                className="flex h-8 items-end space-x-1"
                aria-live="polite"
                aria-atomic="true"
            >
                {errorMessage && (
                    <p className="text-red-500 text-sm">{errorMessage}</p>
                )}
            </div>

            <button
                type="submit"
                disabled={isPending}
                className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary-dark transition-colors shadow-md disabled:opacity-50"
            >
                {isPending ? 'Entrando...' : 'Entrar'}
            </button>

            <div className="text-center mt-4 text-sm text-gray-600">
                ¿No tienes cuenta? <a href="/register" className="text-primary hover:underline font-medium">Regístrate</a>
            </div>
        </form>
    );
}
