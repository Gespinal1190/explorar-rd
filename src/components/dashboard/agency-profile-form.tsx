'use client';

import { updateAgencyProfile } from '@/lib/actions';
import { useActionState } from 'react';

export default function AgencyProfileForm({ agency }: { agency: any }) {
    // We'll need to create this action later or use a generic one
    // For now mocking the action or using a placeholder
    const [message, formAction, isPending] = useActionState(async (prev: any, formData: FormData) => {
        // This action needs to be implemented in lib/actions.ts
        return await updateAgencyProfile(prev, formData);
    }, null);

    return (
        <form action={formAction} className="space-y-6 max-w-2xl bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Editar Perfil de Agencia</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Nombre de la Agencia</label>
                    <input
                        type="text"
                        name="name"
                        defaultValue={agency.name}
                        className="w-full p-3 bg-gray-50 rounded-xl outline-none focus:ring-2 ring-primary/20 transition-all font-medium"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Teléfono</label>
                    <input
                        type="tel"
                        name="phone"
                        defaultValue={agency.phone || ''}
                        className="w-full p-3 bg-gray-50 rounded-xl outline-none focus:ring-2 ring-primary/20 transition-all font-medium"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">WhatsApp</label>
                    <input
                        type="tel"
                        name="whatsapp"
                        defaultValue={agency.whatsapp || ''}
                        className="w-full p-3 bg-green-50 text-green-800 rounded-xl outline-none focus:ring-2 ring-green-200 transition-all font-medium"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Instagram</label>
                    <input
                        type="text"
                        name="instagram"
                        defaultValue={agency.instagram || ''}
                        placeholder="@tuagencia"
                        className="w-full p-3 bg-gray-50 rounded-xl outline-none focus:ring-2 ring-pink-200 transition-all font-medium"
                    />
                </div>
                <div className="col-span-1 md:col-span-2 space-y-2">
                    <label className="text-sm font-bold text-gray-700">Sitio Web</label>
                    <input
                        type="url"
                        name="website"
                        defaultValue={agency.website || ''}
                        placeholder="https://..."
                        className="w-full p-3 bg-gray-50 rounded-xl outline-none focus:ring-2 ring-primary/20 transition-all font-medium"
                    />
                </div>
                <div className="col-span-1 md:col-span-2 space-y-2">
                    <label className="text-sm font-bold text-gray-700">Descripción</label>
                    <textarea
                        name="description"
                        defaultValue={agency.description || ''}
                        rows={4}
                        className="w-full p-3 bg-gray-50 rounded-xl outline-none focus:ring-2 ring-primary/20 transition-all font-medium"
                    />
                </div>
            </div>

            {message && (
                <div className={`text-sm font-bold p-3 rounded-lg ${message.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message.message}
                </div>
            )}

            <div className="pt-4">
                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full md:w-auto px-8 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-colors disabled:opacity-50"
                >
                    {isPending ? 'Guardando...' : 'Guardar Cambios'}
                </button>
            </div>
        </form>
    );
}
