'use client';

import { useTransition } from 'react';
import { deleteBooking } from '@/actions/admin-booking-actions';
import { TrashIcon } from '@heroicons/react/24/outline';

interface Booking {
    id: string;
    createdAt: Date;
    date: Date;
    totalPrice: number;
    status: string;
    user: { email: string; name: string | null };
    tour: { title: string; agency: { name: string } };
}

export default function AdminBookingList({ bookings }: { bookings: any[] }) {
    if (bookings.length === 0) return <div className="p-8 text-center text-gray-500">No hay reservas.</div>;

    return (
        <div className="overflow-x-auto bg-white rounded-xl shadow-sm border">
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
    );
}

function AdminBookingRow({ booking }: { booking: any }) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        if (!confirm("¿Está seguro de eliminar esta reserva permanentemente?")) return;
        startTransition(async () => {
            try {
                await deleteBooking(booking.id);
            } catch (error) {
                console.error(error);
                alert("Error al eliminar reserva");
            }
        });
    };

    return (
        <tr className="hover:bg-gray-50">
            <td className="px-6 py-4">
                <div className="text-xs font-mono text-gray-500 mb-1">{booking.id.slice(-8)}</div>
                <div className="text-sm font-bold text-gray-900">{new Date(booking.date).toLocaleDateString()}</div>
            </td>
            <td className="px-6 py-4">
                <div className="text-sm font-medium text-gray-900">{booking.user.name || "Sin nombre"}</div>
                <div className="text-xs text-gray-500">{booking.user.email}</div>
            </td>
            <td className="px-6 py-4">
                <div className="text-sm font-medium text-gray-900 line-clamp-1">{booking.tour.title}</div>
                <div className="text-xs text-gray-500">{booking.tour.agency.name}</div>
            </td>
            <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                    booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                    {booking.status}
                </span>
            </td>
            <td className="px-6 py-4">
                <button
                    onClick={handleDelete}
                    disabled={isPending}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    title="Eliminar Reserva"
                >
                    <TrashIcon className="w-5 h-5" />
                </button>
            </td>
        </tr>
    );
}
