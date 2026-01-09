"use client";

import { useState } from "react";
import { useRouter } from "@/navigation";
import { useTranslations } from "next-intl";

interface BookingOptions {
    date: string;
    time?: string;
}

interface BookingFormProps {
    tourId: string;
    price: number;
    currency?: string;
    whatsappLink: string;
    availableDates?: BookingOptions[];
    startTime?: string; // Global fallback
}

export function BookingForm({ tourId, price, currency = 'DOP', whatsappLink, availableDates = [], startTime }: BookingFormProps) {
    const router = useRouter();
    const t = useTranslations('BookingForm');
    const [guests, setGuests] = useState(2);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState("");

    // Parse the selected slot back to object to get date/time for display/logic
    const selected = selectedSlot ? JSON.parse(selectedSlot) : null;
    const date = selected?.date || "";
    const time = selected?.time || startTime || t('consult');

    const handleBooking = () => {
        if (!selectedSlot) {
            alert(t('pleaseSelectDate'));
            return;
        }
        setIsLoading(true);
        // Redirect to checkout with query params
        const params = new URLSearchParams({
            tourId,
            date: date,
            time: time,
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
                    {availableDates.length > 0 ? t('availableDates') : t('travelDate')}
                </label>

                {availableDates.length > 0 ? (
                    <select
                        value={selectedSlot}
                        onChange={(e) => setSelectedSlot(e.target.value)}
                        className="w-full bg-transparent outline-none font-bold text-gray-900 cursor-pointer appearance-none"
                        style={{ backgroundImage: 'none' }}
                    >
                        <option value="" disabled>{t('selectDate')}</option>
                        {availableDates.map((d, idx) => {
                            const val = JSON.stringify({ date: d.date, time: d.time });
                            return (
                                <option key={`${d.date}-${d.time}-${idx}`} value={val}>
                                    {new Date(d.date).toLocaleDateString('es-DO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                    {d.time ? ` - ${d.time}` : ''}
                                </option>
                            );
                        })}
                    </select>
                ) : (
                    <input
                        type="date"
                        className="w-full bg-transparent outline-none font-bold text-gray-900"
                        min={new Date().toISOString().split('T')[0]}
                        value={date}
                        onChange={(e) => setSelectedSlot(JSON.stringify({ date: e.target.value, time: startTime }))}
                    />
                )}

                {/* Dynamic Start Time Display */}
                {selectedSlot && (
                    <div className="mt-3 flex items-center gap-2 text-sm text-blue-600 bg-blue-50/50 p-2 rounded-lg border border-blue-100">
                        <span>⏰</span>
                        <span className="font-medium">
                            {t('departureTime')} <strong>{time}</strong>
                        </span>
                    </div>
                )}
            </div>

            {/* Guests Input */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 transition-colors focus-within:ring-2 ring-primary/20">
                <label className="text-xs font-bold text-gray-400 uppercase block mb-1">{t('travelers')}</label>
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => setGuests(Math.max(1, guests - 1))}
                        className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-600 font-bold hover:bg-gray-100"
                    >
                        -
                    </button>
                    <span className="text-gray-900 font-bold">{guests} {guests === 1 ? t('person') : t('people')}</span>
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
                <span className="text-sm font-medium text-gray-500">{t('estimatedTotal')}</span>
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
                {isLoading ? t('processing') : t('bookNow')}
            </button>

            <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-white border-2 border-gray-100 hover:border-gray-200 text-gray-700 font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 group"
            >
                <span className="group-hover:text-[#25D366] transition-colors">💬</span>
                {t('contactWhatsapp')}
            </a>

            <div className="mt-8 pt-6 border-t border-gray-50 text-center">
                <p className="text-xs text-gray-400">
                    {t('securePayment')}
                </p>
            </div>
        </div>
    );
}
