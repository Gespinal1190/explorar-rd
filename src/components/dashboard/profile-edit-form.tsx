'use client';

import { updateUserProfile } from '@/lib/actions';
import { useActionState } from 'react';

export default function ProfileEditForm({ user }: { user: any }) {
    const [message, formAction, isPending] = useActionState(async (prev: any, formData: FormData) => {
        return await updateUserProfile(prev, formData);
    }, null);

    return (
        <form action={formAction} className="space-y-6 max-w-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Nombre Completo</label>
                    <input
                        type="text"
                        name="name"
                        defaultValue={user.name || ''}
                        className="w-full p-3 bg-gray-50 rounded-xl outline-none focus:ring-2 ring-primary/20 transition-all font-medium"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Correo Electrónico</label>
                    <input
                        type="email"
                        name="email"
                        defaultValue={user.email}
                        className="w-full p-3 bg-gray-50 rounded-xl outline-none focus:ring-2 ring-primary/20 transition-all font-medium"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Teléfono (Opcional)</label>
                    <input
                        type="tel"
                        name="phone"
                        defaultValue={user.phone || ''}
                        placeholder="Ej. +1 809 555 5555"
                        className="w-full p-3 bg-gray-50 rounded-xl outline-none focus:ring-2 ring-primary/20 transition-all font-medium"
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 gap-6 pt-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Nueva Contraseña (Opcional)</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Dejar en blanco para mantener la actual"
                        className="w-full p-3 bg-gray-50 rounded-xl outline-none focus:ring-2 ring-primary/20 transition-all font-medium"
                    />
                </div>
            </div>

            {message && <div className="text-sm font-medium text-green-600">{message.message}</div>}

            <div className="pt-4">
                <button
                    type="submit"
                    disabled={isPending}
                    className="px-6 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-colors disabled:opacity-50"
                >
                    {isPending ? 'Guardando...' : 'Guardar Cambios'}
                </button>
            </div>
        </form>
    );
}
