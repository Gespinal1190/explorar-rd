"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface BookingFormProps {
    tourId: string;
    price: number;
    currency?: string;
    whatsappLink: string;
    availableDates?: string[];
}

export function BookingForm({ tourId, price, currency = 'DOP', whatsappLink, availableDates = [], startTime }: BookingFormProps & { startTime?: string }) {
    const router = useRouter();
    const [date, setDate] = useState("");
    const [guests, setGuests] = useState(2);
    const [isLoading, setIsLoading] = useState(false);

    const handleBooking = () => {
        if (!date) {
            alert("Por favor selecciona una fecha");
            return;
        }
        setIsLoading(true);
        // Redirect to checkout with query params
        const params = new URLSearchParams({
            tourId,
            date,
            guests: guests.toString(),
            totalPrice: (price * guests).toString()
        });
        router.push(`/checkout?${params.toString()}`);
    };

    return (
        <div className="space-y-4">
            {/* Date Input */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 transition-colors focus-within:ring-2 ring-primary/20">
                <label className="text-xs font-bold text-gray-400 uppercase block mb-1">
                    {availableDates.length > 0 ? "Próximas Salidas Disponibles" : "Fecha de Viaje"}
                </label>

                {availableDates.length > 0 ? (
                    <select
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full bg-transparent outline-none font-bold text-gray-900 cursor-pointer appearance-none"
                        style={{ backgroundImage: 'none' }} // Remove default arrow in some browsers if needed, or keeping it is fine
                    >
                        <option value="" disabled>Selecciona una fecha...</option>
                        {availableDates.map((d) => (
                            <option key={d} value={d}>
                                {new Date(d).toLocaleDateString('es-DO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                            </option>
                        ))}
                    </select>
                ) : (
                    <input
                        type="date"
                        className="w-full bg-transparent outline-none font-bold text-gray-900"
                        min={new Date().toISOString().split('T')[0]}
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                )}
                )}

                {/* Dynamic Start Time Display */}
                {date && availableDates.length > 0 && startTime && (
                    <div className="mt-3 flex items-center gap-2 text-sm text-blue-600 bg-blue-50/50 p-2 rounded-lg border border-blue-100">
                        <span>⏰</span>
                        <span className="font-medium">Hora de salida: <strong>{startTime}</strong></span>
                    </div>
                )}
            </div>

            {/* Guests Input */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 transition-colors focus-within:ring-2 ring-primary/20">
                <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Viajeros</label>
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => setGuests(Math.max(1, guests - 1))}
                        className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-600 font-bold hover:bg-gray-100"
                    >
                        -
                    </button>
                    <span className="text-gray-900 font-bold">{guests} {guests === 1 ? 'Persona' : 'Personas'}</span>
                    <button
                        onClick={() => setGuests(guests + 1)}
                        className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-600 font-bold hover:bg-gray-100"
                    >
                        +
                    </button>
                </div>
            </div>

            {/* Total Preview */}
            <div className="flex justify-between items-center px-2 py-1">
                <span className="text-sm font-medium text-gray-500">Total estimado</span>
                <span className="text-lg font-black text-gray-900">
                    {currency === 'USD' ? 'USD$' : currency === 'EUR' ? '€' : 'RD$'}
                    {(price * guests).toLocaleString()}
                </span>
            </div>

            <button
                onClick={handleBooking}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#2DD4BF] to-[#0F766E] text-white font-bold py-4 rounded-xl shadow-lg shadow-teal-500/20 hover:shadow-teal-500/40 transition-all transform active:scale-95 text-lg mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {isLoading ? 'Procesando...' : 'Reservar Ahora'}
            </button>

            <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-white border-2 border-gray-100 hover:border-gray-200 text-gray-700 font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 group"
            >
                <span className="group-hover:text-[#25D366] transition-colors">💬</span>
                Contactar por WhatsApp
            </a>

            <div className="mt-8 pt-6 border-t border-gray-50 text-center">
                <p className="text-xs text-gray-400">
                    🔒 Pagos protegidos y reembolso garantizado si cancelas 48h antes.
                </p>
            </div>
        </div>
    );
}
