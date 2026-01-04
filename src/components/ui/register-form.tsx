'use client';

import { useActionState } from 'react';
import { register } from '@/lib/actions';
import { useSearchParams } from 'next/navigation';

export default function RegisterForm() {
    const searchParams = useSearchParams();
    const role = searchParams.get('role') === 'agency' ? 'AGENCY' : 'USER';

    const [errorMessage, formAction, isPending] = useActionState(
        register,
        undefined
    );

    return (
        <form action={formAction} className="space-y-4 w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
            <h1 className="text-2xl font-bold text-center text-primary mb-6">
                {role === 'AGENCY' ? 'Regístrate como Agencia' : 'Crear Cuenta'}
            </h1>

            <input type="hidden" name="role" value={role} />

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
                    {role === 'AGENCY' ? 'Nombre de la Agencia' : 'Nombre Completo'}
                </label>
                <input
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    id="name"
                    type="text"
                    name="name"
                    placeholder={role === 'AGENCY' ? 'Ej. Viajes Tropicales' : 'Tu Nombre'}
                    required
                />
            </div>

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
                className="w-full bg-secondary text-white font-bold py-3 rounded-lg hover:bg-emerald-600 transition-colors shadow-md disabled:opacity-50"
            >
                {isPending ? 'Creando cuenta...' : 'Registrarse'}
            </button>

            <div className="text-center mt-4 text-sm text-gray-600">
                ¿Ya tienes cuenta? <a href="/login" className="text-primary hover:underline font-medium">Inicia Sesión</a>
            </div>
            {role !== 'AGENCY' && (
                <div className="text-center mt-2 text-xs text-gray-500">
                    ¿Eres una agencia? <a href="/register?role=agency" className="text-secondary hover:underline">Regístrate aquí</a>
                </div>
            )}
        </form>
    );
}
