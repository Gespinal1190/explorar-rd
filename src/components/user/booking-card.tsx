'use client';

import { useState } from 'react';
import Link from 'next/link';
import { submitPaymentReceipt } from '@/actions/user-booking-actions';

export default function BookingCard({ booking }: { booking: any }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [receiptUrl, setReceiptUrl] = useState(booking.paymentReceiptUrl || "");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Check if we need to show payment instructions
    const showPaymentInstructions = booking.paymentMethod === 'transfer' && booking.paymentStatus === 'PENDING';
    const bankAccounts = booking.tour.agency.bankAccounts || [];

    const handleFileUpload = async (file: File) => {
        setIsSubmitting(true);
        try {
            // 1. Upload File
            const formData = new FormData();
            formData.append("file", file);

            const uploadRes = await fetch("/api/upload", {
                method: "POST",
                body: formData
            });

            if (!uploadRes.ok) throw new Error("Upload failed");

            const data = await uploadRes.json();
            const uploadedUrl = data.url;

            // 2. Submit Receipt URL to Booking
            await submitPaymentReceipt(booking.id, uploadedUrl);

            setReceiptUrl(uploadedUrl);
            alert("Comprobante subido exitosamente");
        } catch (error) {
            console.error(error);
            alert("Error al subir comprobante");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-32 h-32 bg-gray-100 rounded-xl overflow-hidden shadow-inner flex-shrink-0">
                    {booking.tour.images[0] && (
                        <img src={booking.tour.images[0].url} alt="" className="w-full h-full object-cover" />
                    )}
                </div>
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex gap-2 mb-2">
                                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                                    booking.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                                        booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500'
                                    }`}>
                                    {booking.status === 'CONFIRMED' ? 'Confirmada' : booking.status === 'PENDING' ? 'Pendiente' : booking.status}
                                </span>
                                {booking.paymentStatus === 'PENDING' && (
                                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-orange-100 text-orange-700">
                                        Pago Pendiente
                                    </span>
                                )}
                                {booking.paymentStatus === 'PAID' && (
                                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-green-100 text-green-700">
                                        Pagado
                                    </span>
                                )}
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 leading-tight">{booking.tour.title}</h3>
                            <p className="text-sm text-gray-500 mt-1">📅 {new Date(booking.date).toLocaleDateString()} • {booking.people} Personas</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-400 font-bold uppercase">Total</p>
                            <p className="text-xl font-black text-gray-900">RD${booking.totalPrice.toLocaleString()}</p>
                        </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-50 flex flex-wrap gap-4 items-center justify-between">
                        <div className="flex gap-4">
                            <Link href={`/tours/${booking.tourId}`} className="text-xs font-bold text-gray-600 hover:text-primary">Ver Tour</Link>
                            {booking.status === 'CONFIRMED' && (
                                <button className="text-xs font-bold text-primary hover:text-primary-dark">Descargar Ticket</button>
                            )}
                        </div>

                        {showPaymentInstructions && (
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="text-xs font-bold bg-primary/10 text-primary px-3 py-1.5 rounded-lg hover:bg-primary/20 transition-colors"
                            >
                                {isExpanded ? "Ocultar Datos Pago" : "Pagar Ahora"}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Payment Instructions Section */}
            {showPaymentInstructions && isExpanded && (
                <div className="mt-6 p-6 bg-gray-50 rounded-xl border border-gray-100 animate-in fade-in slide-in-from-top-2">
                    <h4 className="font-bold text-gray-900 mb-4">Instrucciones de Pago</h4>
                    <p className="text-sm text-gray-600 mb-4">Por favor realiza la transferencia a una de las siguientes cuentas y sube el comprobante.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                        {bankAccounts.length > 0 ? bankAccounts.map((account: any) => (
                            <div key={account.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                                <p className="font-bold text-gray-900 text-sm">{account.bankName}</p>
                                <p className="font-mono text-gray-600 text-sm my-1">{account.accountNumber}</p>
                                <div className="text-xs text-gray-400">
                                    <span className="uppercase">{account.accountType}</span> • {account.beneficiaryName}
                                </div>
                            </div>
                        )) : (
                            <div className="col-span-full text-center text-gray-400 text-sm p-4 bg-white rounded-lg border border-dashed">
                                No hay cuentas configuradas por la agencia. Contactar soporte.
                            </div>
                        )}
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Subir Comprobante (Imagen)</label>

                        {receiptUrl ? (
                            <div className="mb-4">
                                <p className="text-xs text-green-600 font-bold mb-2">✅ Comprobante enviado</p>
                                <a href={receiptUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary underline">Ver Comprobante Actual</a>
                                <button onClick={() => setReceiptUrl("")} className="ml-4 text-xs text-gray-400 hover:text-gray-600">Cambiar</button>
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
                                    }}
                                    className="flex-1 p-2 border border-gray-200 rounded-lg text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                                    disabled={isSubmitting}
                                />
                                {isSubmitting && <span className="text-sm text-gray-400 self-center">Subiendo...</span>}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
