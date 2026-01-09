'use client';

import { useState } from 'react';
import { promoteTour } from '@/lib/promote-actions';
import { useRouter } from 'next/navigation';
import { PayPalPaymentButton } from '../payments/paypal-button';

interface Plan {
    id: string;
    slug: string;
    name: string;
    price: number;
    description: string | null;
}

export default function PromoteModal({ tourId, isOpen, onClose, plans, agencyId }: { tourId: string, isOpen: boolean, onClose: () => void, plans?: Plan[], agencyId: string }) {
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const router = useRouter();

    if (!isOpen) return null;

    const displayPlans = plans || [];

    const onPayPalSuccess = async (details: any) => {
        setIsProcessing(true);
        try {
            const res = await fetch("/api/payments/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    orderId: details.id,
                    payerId: details.payer.payer_id,
                    amount: details.purchase_units[0].amount.value,
                    currency: details.purchase_units[0].amount.currency_code,
                    type: "AD_PROMOTION",
                    agencyId: agencyId,
                    metadata: {
                        tourId: tourId,
                        planSlug: selectedPlan?.slug,
                        planName: selectedPlan?.name
                    }
                })
            });

            if (res.ok) {
                onClose();
                router.refresh();
                alert("¡Tour promocionado exitosamente! Ahora aparecerá en la sección de Destacados.");
            } else {
                const err = await res.json();
                alert("Error al verificar el pago: " + (err.error || "Desconocido"));
            }
        } catch (error) {
            console.error("Payment Capture Error", error);
            alert("Error de conexión al procesar el pago.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-white/20">
                <div className="p-8 border-b">
                    <h2 className="text-2xl font-black text-gray-900 tracking-tighter">🚀 Destacar mi Anuncio</h2>
                    <p className="text-sm text-gray-500 font-medium">Llega a miles de viajeros más posicionando tu tour en lo más alto.</p>
                </div>

                <div className="p-8 space-y-4 max-h-[60vh] overflow-y-auto">
                    {displayPlans.length === 0 && <p className="text-center text-gray-500 py-4 font-medium">No hay planes de promoción activos.</p>}

                    {displayPlans.map(plan => (
                        <div
                            key={plan.id}
                            onClick={() => setSelectedPlan(plan)}
                            className={`group border-2 rounded-2xl p-6 cursor-pointer transition-all hover:border-primary relative ${selectedPlan?.slug === plan.slug ? 'border-primary bg-primary/[0.03]' : 'border-gray-100 hover:bg-gray-50'}`}
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg group-hover:text-primary transition-colors">{plan.name}</h3>
                                    <p className="text-sm text-gray-500 font-medium mt-1">{plan.description}</p>
                                </div>
                                <div className="text-right">
                                    <span className="font-black text-xl text-gray-900">RD$ {plan.price.toLocaleString()}</span>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">~US$ {(plan.price / 58).toFixed(2)}</p>
                                </div>
                            </div>
                            {selectedPlan?.slug === plan.slug && (
                                <div className="absolute top-4 right-4 text-primary animate-in zoom-in">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.74-5.24Z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="p-8 bg-gray-50 border-t flex flex-col gap-6">
                    {selectedPlan ? (
                        <div className="space-y-4 animate-in slide-in-from-bottom duration-300">
                            <div className="flex justify-between items-center text-sm font-bold text-gray-600">
                                <span>Total a pagar:</span>
                                <span className="text-xl text-gray-900">US$ {(selectedPlan.price / 58).toFixed(2)}</span>
                            </div>

                            <PayPalPaymentButton
                                amount={parseFloat((selectedPlan.price / 58).toFixed(2))}
                                currency="USD"
                                description={`Promoción: ${selectedPlan.name} - Tour ID: ${tourId}`}
                                metadata={{
                                    tourId: tourId,
                                    planSlug: selectedPlan.slug
                                }}
                                onSuccess={onPayPalSuccess}
                            />

                            <p className="text-[10px] text-center text-gray-400 font-medium">Pago seguro procesado por PayPal. Tu promoción se activará al instante.</p>
                        </div>
                    ) : (
                        <p className="text-center font-bold text-gray-400 py-2">Selecciona un plan para continuar con el pago</p>
                    )}

                    {!selectedPlan && (
                        <button
                            onClick={onClose}
                            className="w-full py-4 text-gray-500 font-bold hover:text-gray-900 transition-colors bg-white rounded-2xl border border-gray-100"
                        >
                            Cancelar
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
