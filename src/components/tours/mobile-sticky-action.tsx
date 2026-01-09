"use client";

import { useLocale } from "next-intl";

interface Props {
    price: number;
    currency: string;
}

export function MobileStickyAction({ price, currency }: Props) {
    const locale = useLocale();

    const handleScroll = (e: React.MouseEvent) => {
        e.preventDefault();
        const element = document.getElementById('mobile-booking-form');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 lg:hidden z-50 flex items-center justify-between shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
            <div className="flex flex-col">
                <span className="text-xs text-gray-500 font-bold uppercase">Desde</span>
                <span className="text-2xl font-black text-primary">
                    {currency === 'USD' ? 'US$' : currency === 'EUR' ? '€' : 'RD$'}
                    {price.toLocaleString(locale)}
                </span>
            </div>
            <button
                onClick={handleScroll}
                className="bg-primary text-white px-8 py-3 rounded-xl font-black shadow-lg shadow-primary/20"
            >
                Reservar Ahora
            </button>
        </div>
    );
}
