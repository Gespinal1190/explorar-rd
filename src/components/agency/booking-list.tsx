'use client';

import { useState, useTransition } from 'react';
import { updateBookingStatus, updatePaymentStatus } from '@/actions/booking-actions';
import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';

interface Booking {
    id: string;
    createdAt: Date | string;
    date: Date | string;
    people: number;
    totalPrice: number;
    status: string;
    paymentStatus: string;
    paymentReceiptUrl?: string;
    tourTitle: string;
    user: {
        name: string | null;
        email: string;
        phone: string | null;
    };
}

export default function BookingList({ bookings }: { bookings: Booking[] }) {
    if (bookings.length === 0) {
        return <div className="p-12 text-center text-gray-500">No hay reservas aún.</div>;
    }

    return (
        <>
            {/* Mobile Card View */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {bookings.map((booking) => (
                    <div key={booking.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 space-y-4">
                        <div className="flex justify-between">
                            <div>
                                <h3 className="font-bold text-gray-900 line-clamp-1">{booking.tourTitle}</h3>
                                <p className="text-sm text-gray-500">{booking.date ? new Date(booking.date).toLocaleDateString() : 'N/A'} • {booking.people} pers.</p>
                            </div>
                            <div className="text-right">
                                <p className="font-black text-gray-900">RD$ {booking.totalPrice.toLocaleString()}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                            <div className="flex flex-col">
                                <span className="font-bold">{booking.user.name || "Sin nombre"}</span>
                                <span className="text-xs">{booking.user.email}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-50">
                            <div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Pago</span>
                                <PaymentSelect booking={booking} />
                            </div>
                            <div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Estado</span>
                                <StatusSelect booking={booking} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left bg-white">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Cliente</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Tour / Detalles</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Pago</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Estado Reserva</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {bookings.map((booking) => (
                            <BookingRow key={booking.id} booking={booking} />
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

function PaymentSelect({ booking }: { booking: Booking }) {
    const [isPending, startTransition] = useTransition();

    const handlePaymentStatusChange = (newStatus: string) => {
        startTransition(async () => {
            try {
                await updatePaymentStatus(booking.id, newStatus);
            } catch (error) {
                console.error("Error updating payment status:", error);
                alert("Error al actualizar el pago");
            }
        });
    };

    return (
        <div className="w-full">
            <select
                disabled={isPending}
                value={booking.paymentStatus}
                onChange={(e) => handlePaymentStatusChange(e.target.value)}
                className={`
                    block w-full rounded-md border-0 py-1.5 pl-3 pr-8 text-sm ring-1 ring-inset focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6
                    ${booking.paymentStatus === 'PAID'
                        ? 'text-green-700 bg-green-50 ring-green-600/20'
                        : 'text-yellow-700 bg-yellow-50 ring-yellow-600/20'}
                `}
            >
                <option value="PENDING">Pendiente</option>
                <option value="PAID">Pagado</option>
            </select>
            {booking.paymentReceiptUrl && (
                <a
                    href={booking.paymentReceiptUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mt-1 text-[10px] md:text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline"
                >
                    📎 Ver Comprobante
                </a>
            )}
        </div>
    );
}

function StatusSelect({ booking }: { booking: Booking }) {
    const [isPending, startTransition] = useTransition();

    const handleStatusChange = (newStatus: string) => {
        startTransition(async () => {
            try {
                await updateBookingStatus(booking.id, newStatus);
            } catch (error) {
                console.error("Error updating status:", error);
                alert("Error al actualizar el estado");
            }
        });
    };

    return (
        <select
            disabled={isPending}
            value={booking.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className={`
                block w-full rounded-md border-0 py-1.5 pl-3 pr-8 text-sm ring-1 ring-inset focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6
                ${booking.status === 'CONFIRMED' ? 'text-green-700 bg-green-50 ring-green-600/20' :
                    booking.status === 'CANCELLED' ? 'text-red-700 bg-red-50 ring-red-600/20' :
                        booking.status === 'COMPLETED' ? 'text-blue-700 bg-blue-50 ring-blue-600/20' :
                            'text-yellow-700 bg-yellow-50 ring-yellow-600/20'}
            `}
        >
            <option value="PENDING">Pendiente</option>
            <option value="CONFIRMED">Confirmada</option>
            <option value="CANCELLED">Cancelada</option>
            <option value="COMPLETED">Completada</option>
        </select>
    );
}

function BookingRow({ booking }: { booking: Booking }) {
    return (
        <tr className="hover:bg-gray-50/50 transition-colors">
            <td className="px-6 py-4">
                <div className="flex flex-col">
                    <span className="font-semibold text-gray-900">{booking?.user?.name || "Sin nombre"}</span>
                    <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                        <EnvelopeIcon className="w-3 h-3" />
                        <span>{booking?.user?.email || 'N/A'}</span>
                    </div>
                    {booking?.user?.phone && (
                        <div className="flex items-center gap-1 text-sm text-gray-500 mt-0.5">
                            <PhoneIcon className="w-3 h-3" />
                            <span>{booking.user.phone}</span>
                        </div>
                    )}
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="flex flex-col">
                    <span className="font-medium text-gray-900">{booking?.tourTitle || "Tour Desconocido"}</span>
                    <span className="text-sm text-gray-500">
                        {booking?.date ? new Date(booking.date).toLocaleDateString() : 'N/A'} • {booking?.people || 0} pers.
                    </span>
                    <span className="text-sm font-bold text-gray-900 mt-1">
                        RD$ {(booking?.totalPrice || 0).toLocaleString()}
                    </span>
                </div>
            </td>
            <td className="px-6 py-4">
                <PaymentSelect booking={booking} />
            </td>
            <td className="px-6 py-4">
                <StatusSelect booking={booking} />
            </td>
        </tr>
    );
}
