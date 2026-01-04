'use client';

import { useState } from 'react';
import Link from "next/link";
import PromoteModal from "@/components/dashboard/promote-modal";
import { deleteTour } from "@/lib/actions";

interface Tour {
    id: string;
    title: string;
    location: string;
    price: number;
    currency?: string;
    featuredExpiresAt?: Date | string | null;
}

export default function AgencyToursList({ tours, plans }: { tours: Tour[], plans: any[] }) {
    const [promoteId, setPromoteId] = useState<string | null>(null);

    return (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-gray-50 border-b">
                    <tr>
                        <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Título</th>
                        <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Ubicación</th>
                        <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Precio</th>
                        <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Estado</th>
                        <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {tours.map((tour) => {
                        const isFeatured = tour.featuredExpiresAt && new Date(tour.featuredExpiresAt) > new Date();

                        return (
                            <tr key={tour.id}>
                                <td className="px-6 py-4 font-medium">{tour.title}</td>
                                <td className="px-6 py-4 text-gray-500">{tour.location}</td>
                                <td className="px-6 py-4 text-gray-900 font-bold">
                                    {tour.currency === 'USD' ? 'USD$' : tour.currency === 'EUR' ? '€' : 'RD$'} {tour.price.toLocaleString()}
                                </td>
                                <td className="px-6 py-4">
                                    {isFeatured ? (
                                        <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full border border-yellow-200">
                                            🌟 Destacado
                                        </span>
                                    ) : (
                                        <span className="text-gray-400 text-sm">Estándar</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 flex gap-4 items-center">
                                    <button
                                        onClick={() => setPromoteId(tour.id)}
                                        className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full hover:shadow-md transition-all"
                                    >
                                        Destacar
                                    </button>
                                    <Link href={`/dashboard/agency/tours/${tour.id}/edit`} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                        Editar
                                    </Link>
                                    <button
                                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                                        onClick={async () => {
                                            if (confirm('¿Estás seguro de eliminar este tour?')) {
                                                await deleteTour(tour.id);
                                            }
                                        }}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                    {tours.length === 0 && (
                        <tr>
                            <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                No tienes tours creados aún.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {promoteId && (
                <PromoteModal
                    tourId={promoteId}
                    isOpen={!!promoteId}
                    onClose={() => setPromoteId(null)}
                    plans={plans}
                />
            )}
        </div>
    );
}
