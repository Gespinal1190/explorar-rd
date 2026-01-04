'use client';

import { useTransition } from 'react';
import { deleteBooking } from '@/actions/admin-booking-actions';
import { TrashIcon } from '@heroicons/react/24/outline';

export default function AdminBookingList({ bookings }: { bookings: any[] }) {
    if (bookings.length === 0) return <div className="p-8 text-center text-gray-500">No hay reservas.</div>;

    return (
        <>
            {/* Mobile Card View */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {bookings.map((booking) => (
                    <div key={booking.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-3">
                        <div className="flex justify-between items-start">
                            <div>
                                <span className="text-xs font-mono text-gray-400">#{booking?.id?.slice(-8)}</span>
                                <p className="font-bold text-gray-900">{booking?.tour?.title || 'Tour Desconocido'}</p>
                                <p className="text-xs text-gray-500">{booking?.tour?.agency?.name}</p>
                            </div>
                            <StatusBadge status={booking?.status} />
                        </div>

                        <div className="flex justify-between items-center text-sm border-t border-gray-50 pt-3">
                            <div className="flex flex-col">
                                <span className="text-gray-900 font-medium">{booking?.user?.name || "Sin nombre"}</span>
                                <span className="text-gray-500 text-xs">{booking?.date ? new Date(booking.date).toLocaleDateString() : 'N/A'}</span>
                            </div>
                            <DeleteButton bookingId={booking.id} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-hidden bg-white rounded-xl shadow-sm border">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">ID / Fecha</th>
                            <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Cliente</th>
                            <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Tour / Agencia</th>
                            <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Estado</th>
                            <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {bookings.map((booking) => (
                            <AdminBookingRow key={booking.id} booking={booking} />
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

function StatusBadge({ status }: { status: string }) {
    return (
        <span className={`px-2 py-1 rounded-full text-xs font-bold ${status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
            }`}>
            {status || 'N/A'}
        </span>
    );
}

function DeleteButton({ bookingId }: { bookingId: string }) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        if (!confirm("¿Está seguro de eliminar esta reserva permanentemente?")) return;
        startTransition(async () => {
            try {
                await deleteBooking(bookingId);
            } catch (error) {
                console.error(error);
                alert("Error al eliminar reserva");
            }
        });
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isPending}
            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
            title="Eliminar Reserva"
        >
            <TrashIcon className="w-5 h-5" />
        </button>
    );
}

function AdminBookingRow({ booking }: { booking: any }) {
    return (
        <tr className="hover:bg-gray-50">
            <td className="px-6 py-4">
                <div className="text-xs font-mono text-gray-500 mb-1">{(booking?.id || '').slice(-8)}</div>
                <div className="text-sm font-bold text-gray-900">{booking?.date ? new Date(booking.date).toLocaleDateString() : 'N/A'}</div>
            </td>
            <td className="px-6 py-4">
                <div className="text-sm font-medium text-gray-900">{booking?.user?.name || "Sin nombre"}</div>
                <div className="text-xs text-gray-500">{booking?.user?.email || 'N/A'}</div>
            </td>
            <td className="px-6 py-4">
                <div className="text-sm font-medium text-gray-900 line-clamp-1">{booking?.tour?.title || 'Tour Desconocido'}</div>
                <div className="text-xs text-gray-500">{booking?.tour?.agency?.name || 'Agencia Desconocida'}</div>
            </td>
            <td className="px-6 py-4">
                <StatusBadge status={booking?.status} />
            </td>
            <td className="px-6 py-4">
                <DeleteButton bookingId={booking.id} />
            </td>
        </tr>
    );
}
