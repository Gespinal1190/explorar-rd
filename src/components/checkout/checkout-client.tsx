"use client";

import { useState } from "react";
import { useRouter, Link } from "@/navigation";
import { useTranslations } from "next-intl";

interface CheckoutClientProps {
    tour: any;
    date: string;
    time?: string;
    guests: number;
    user: any;
}

export function CheckoutClient({ tour, date, time, guests, user }: CheckoutClientProps) {
    const t = useTranslations('Checkout');
    const [paymentMethod, setPaymentMethod] = useState("transfer");
    const [isProcessing, setIsProcessing] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [phone, setPhone] = useState(user.phone || "");
    const router = useRouter();

    const handleConfirm = async () => {
        console.log("Confirm button clicked. Terms accepted:", termsAccepted);
        if (!termsAccepted) {
            alert("Debes aceptar los términos y condiciones para continuar.");
            return;
        }

        if (!phone) {
            alert("El número de teléfono es obligatorio para confirmar la reserva.");
            return;
        }

        setIsProcessing(true);

        try {
            const res = await fetch("/api/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    tourId: tour.id,
                    date,
                    time,
                    people: guests,
                    totalPrice: tour.price * guests,
                    paymentMethod,
                    phone
                })
            });

            if (!res.ok) {
                const errorData = await res.json();
                if (res.status === 401) {
                    alert("Tu sesión ha expirado. Por favor inicia sesión nuevamente.");
                    router.push("/login?callbackUrl=" + window.location.pathname);
                    return;
                }
                throw new Error(errorData.message || errorData.error || "Error al reservar");
            }

            const data = await res.json();

            // alert(`¡Reserva Creada con Éxito! ID: ${data.booking.id}`); 
            router.push(`/checkout/success?bookingId=${data.booking.id}`);
        } catch (error) {
            if (!isProcessing) return; // Avoid alert if we already redirected
            alert("Hubo un error al procesar tu reserva. Detalle: " + (error instanceof Error ? error.message : "Error desconocido"));
            console.error(error);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* User Info */}
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    👤 {t('yourData')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="p-3 bg-gray-50 rounded-xl">
                        <span className="block text-gray-400 text-xs font-bold uppercase">Nombre</span>
                        <span className="font-bold text-gray-900">{user.name}</span>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl">
                        <span className="block text-gray-400 text-xs font-bold uppercase">Email</span>
                        <span className="font-bold text-gray-900">{user.email}</span>
                    </div>
                    <div className="md:col-span-2 p-3 bg-gray-50 rounded-xl">
                        <label htmlFor="phone" className="block text-gray-400 text-xs font-bold uppercase mb-1">Teléfono</label>
                        {user.phone ? (
                            <span className="font-bold text-gray-900">{user.phone}</span>
                        ) : (
                            <input
                                id="phone"
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="809 000 0000"
                                className="w-full bg-transparent border-b border-gray-300 focus:border-primary outline-none font-bold text-gray-900 placeholder:font-normal"
                            />
                        )}
                    </div>
                </div>
            </section>

            {/* Payment Methods */}
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    💳 {t('paymentMethod')}
                </h3>

                <div className="space-y-4">
                    {/* Stripe Option */}
                    <div
                        onClick={() => setPaymentMethod("stripe")}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-4 ${paymentMethod === 'stripe' ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-gray-200'}`}
                    >
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'stripe' ? 'border-primary' : 'border-gray-300'}`}>
                            {paymentMethod === 'stripe' && <div className="w-3 h-3 bg-primary rounded-full" />}
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-gray-900">{t('creditCard')}</h4>
                            <p className="text-xs text-gray-500">Pago seguro vía Stripe</p>
                        </div>
                        <span className="text-xl">💳</span>
                    </div>

                    {/* Transfer Option */}
                    <div
                        onClick={() => setPaymentMethod("transfer")}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-4 ${paymentMethod === 'transfer' ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-gray-200'}`}
                    >
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'transfer' ? 'border-primary' : 'border-gray-300'}`}>
                            {paymentMethod === 'transfer' && <div className="w-3 h-3 bg-primary rounded-full" />}
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-gray-900">{t('transfer')}</h4>
                            <p className="text-xs text-gray-500">Banco Popular / BHD / Reservas</p>
                        </div>
                        <span className="text-xl">🏦</span>
                    </div>

                    {/* Cash Option */}
                    <div
                        onClick={() => setPaymentMethod("cash")}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-4 ${paymentMethod === 'cash' ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-gray-200'}`}
                    >
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cash' ? 'border-primary' : 'border-gray-300'}`}>
                            {paymentMethod === 'cash' && <div className="w-3 h-3 bg-primary rounded-full" />}
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-gray-900">{t('cash')}</h4>
                            <p className="text-xs text-gray-500">Sujeto a confirmación por la agencia</p>
                        </div>
                        <span className="text-xl">💵</span>
                    </div>
                </div>

                {/* Dynamic Content based on Selection */}
                {paymentMethod === 'stripe' && (
                    <div className="mt-6 p-6 bg-gray-50 border border-gray-100 rounded-xl animate-in fade-in slide-in-from-top-2">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-bold text-gray-900">Detalles de la Tarjeta</h4>
                            <div className="flex gap-2">
                                <span className="text-xl">💳</span>
                                <span className="text-xl">💳</span>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Número de Tarjeta</label>
                                <input type="text" placeholder="0000 0000 0000 0000" className="w-full p-3 bg-white border border-gray-200 rounded-lg outline-none focus:border-primary text-gray-900 font-mono" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Expiración</label>
                                    <input type="text" placeholder="MM/YY" className="w-full p-3 bg-white border border-gray-200 rounded-lg outline-none focus:border-primary text-gray-900 font-mono" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">CVC</label>
                                    <input type="text" placeholder="123" className="w-full p-3 bg-white border border-gray-200 rounded-lg outline-none focus:border-primary text-gray-900 font-mono" />
                                </div>
                            </div>
                        </div>
                        <p className="text-xs text-gray-400 mt-4 text-center">🔐 Pagos procesados de forma segura con encriptación SSL.</p>
                    </div>
                )}

                {paymentMethod === 'transfer' && (
                    <div className="mt-6 p-4 bg-yellow-50 border border-yellow-100 rounded-xl text-sm text-yellow-800 animate-in fade-in slide-in-from-top-2">
                        <p className="font-bold mb-1">📢 Instrucciones:</p>
                        <p>Al confirmar, recibirás los datos bancarios. Tendrás 24 horas para subir el comprobante de pago en tu perfil.</p>
                    </div>
                )}
            </section>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-3 p-2">
                <div className="flex items-center h-5">
                    <input
                        id="terms"
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="w-5 h-5 border-2 border-gray-300 rounded text-teal-600 focus:ring-teal-500 transition-colors cursor-pointer"
                    />
                </div>
                <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer select-none">
                    {t.rich('terms', {
                        link: (chunks) => <Link href="/legal/terms" target="_blank" className="font-bold underline text-primary hover:text-primary/80">{chunks}</Link>
                    })}
                </label>
            </div>

            <button
                type="button"
                onClick={handleConfirm}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-[#2DD4BF] to-[#0F766E] text-white font-black py-5 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all text-xl disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {isProcessing ? t('processing') : `${t('confirmAndPay')} ${tour.currency === 'USD' ? 'USD$' : tour.currency === 'EUR' ? '€' : 'RD$'}${(tour.price * guests).toLocaleString()}`}
            </button>
        </div>
    );
}
