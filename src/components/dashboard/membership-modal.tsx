'use client';

import { useState } from 'react';
import { upgradeAgencyTier } from '@/lib/membership-actions';
import { PayPalPaymentButton } from '../payments/paypal-button';

interface Plan {
    id: string;
    slug: string;
    name: string;
    price: number;
    description: string | null;
    features: string | null;
}

type Step = 'select' | 'pay' | 'success';

export default function MembershipModal({ isOpen, onClose, plans, agencyId }: { isOpen: boolean, onClose: () => void, plans: Plan[], agencyId: string }) {
    const [step, setStep] = useState<Step>('select');
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    if (!isOpen) return null;

    const handleSelect = (plan: Plan) => {
        setSelectedPlan(plan);
        setStep('pay');
    };

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPlan) return;
        setIsProcessing(true);

        // Mock Payment Success Delay
        setTimeout(async () => {
            const result = await upgradeAgencyTier(selectedPlan.slug);
            if (result.success) {
                setStep('success');
            } else {
                alert(result.error);
                setIsProcessing(false);
            }
        }, 2000);
    };

    const reset = () => {
        setStep('select');
        setSelectedPlan(null);
        setIsProcessing(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden relative border border-white/20">

                {/* Close Button */}
                <button
                    onClick={reset}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 z-10 p-2 bg-gray-50 rounded-full transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                </button>

                {step === 'select' && (
                    <div className="p-8">
                        <div className="mb-8">
                            <h2 className="text-3xl font-black text-gray-900 tracking-tighter">Eleva tu Negocio</h2>
                            <p className="text-gray-500 font-medium">Elige el plan que mejor se adapte a tu agencia.</p>
                        </div>

                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {plans.map(plan => (
                                <div
                                    key={plan.id}
                                    onClick={() => handleSelect(plan)}
                                    className="group flex items-center justify-between p-6 rounded-2xl border-2 border-gray-100 cursor-pointer hover:border-primary/40 hover:bg-primary/[0.02] transition-all"
                                >
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-lg group-hover:text-primary transition-colors">{plan.name}</h3>
                                        <p className="text-sm text-gray-500 font-medium">{plan.description}</p>
                                    </div>
                                    <div className="text-right flex flex-col items-end">
                                        <span className="text-xl font-black text-gray-900">RD$ {plan.price.toLocaleString()}</span>
                                        <div className="mt-2 w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-primary border border-gray-100 group-hover:bg-primary group-hover:text-white transition-all">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {step === 'pay' && selectedPlan && (
                    <div className="p-8 animate-in slide-in-from-right duration-300">
                        <button
                            onClick={() => setStep('select')}
                            className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-primary mb-6 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                            </svg>
                            Volver a planes
                        </button>

                        <div className="mb-8">
                            <h2 className="text-2xl font-black text-gray-900">Pasarela de Pago Segura</h2>
                            <p className="text-sm text-gray-500 font-medium">Estás a un paso de ser Socio PRO. Total: <span className="text-gray-900 font-black">US$ {(selectedPlan.price / 58).toFixed(2)}</span> ({selectedPlan.price.toLocaleString()} DOP)</p>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
                                <span className="text-blue-500 mt-0.5">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z" clipRule="evenodd" />
                                    </svg>
                                </span>
                                <p className="text-xs text-blue-700 leading-relaxed font-medium">El pago se procesará en Dólares Estadounidenses (USD) a través de PayPal. El acceso a los beneficios PRO será inmediato tras la confirmación.</p>
                            </div>

                            <PayPalPaymentButton
                                amount={parseFloat((selectedPlan.price / 58).toFixed(2))}
                                currency="USD"
                                description={`Membresía PRO - ${selectedPlan.name}`}
                                metadata={{
                                    planId: selectedPlan.id,
                                    slug: selectedPlan.slug,
                                    agencyId: agencyId // Need to pass agencyId prop to modal too!
                                }}
                                onSuccess={async (details) => {
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
                                                type: "MEMBERSHIP_PRO",
                                                agencyId: agencyId, // Need agencyId here
                                                metadata: {
                                                    planId: selectedPlan.id,
                                                    planName: selectedPlan.name
                                                }
                                            })
                                        });

                                        if (res.ok) {
                                            setStep('success');
                                        } else {
                                            const err = await res.json();
                                            alert("Error registrando el pago: " + err.error);
                                        }
                                    } catch (e) {
                                        console.error(e);
                                        alert("Error de conexión");
                                    } finally {
                                        setIsProcessing(false);
                                    }
                                }}
                            />

                            <div className="pt-4 border-t border-gray-100 mt-4">
                                <p className="text-xs text-center text-gray-500 mb-2">¿Tienes problemas con el botón?</p>
                                <a
                                    href="https://paypal.me/GermanEspinal777"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full py-3 text-center text-primary font-bold text-sm bg-primary/5 hover:bg-primary/10 rounded-xl transition-colors"
                                >
                                    Pagar manualmente vía PayPal.me
                                </a>
                                <p className="text-[10px] text-center text-gray-400 mt-2">
                                    Nota: Si pagas manualmente, envíanos el comprobante por WhatsApp para activar tu membresía.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {step === 'success' && (
                    <div className="p-12 text-center animate-in zoom-in duration-500">
                        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 text-5xl animate-bounce">
                            ✓
                        </div>
                        <h2 className="text-4xl font-black text-gray-900 tracking-tighter mb-4">¡Felicidades, Socio PRO!</h2>
                        <p className="text-gray-500 font-medium mb-8">Pago procesado con éxito. Ahora ya tienes acceso total a los beneficios PRO. Tu cuenta ha sido actualizada instantáneamente.</p>

                        <div className="bg-gray-50 p-6 rounded-2xl mb-8 space-y-3">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Próximos Pasos:</p>
                            <div className="flex items-center gap-3 text-left">
                                <div className="w-2 h-2 rounded-full bg-primary"></div>
                                <p className="text-sm font-bold text-gray-700">Verás tu insignia PRO en todos tus tours.</p>
                            </div>
                            <div className="flex items-center gap-3 text-left">
                                <div className="w-2 h-2 rounded-full bg-primary"></div>
                                <p className="text-sm font-bold text-gray-700">Tus tours subirán posiciones en las búsquedas.</p>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                reset();
                                window.location.reload();
                            }}
                            className="w-full py-4 bg-gray-900 text-white font-black rounded-2xl hover:bg-black transition-all shadow-lg"
                        >
                            Ir a ver mi perfil PRO
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}
