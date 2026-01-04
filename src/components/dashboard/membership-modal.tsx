'use client';

import { useState } from 'react';
import { upgradeAgencyTier } from '@/lib/membership-actions';

interface Plan {
    id: string;
    slug: string;
    name: string;
    price: number;
    description: string | null;
    features: string | null;
}

type Step = 'select' | 'pay' | 'success';

export default function MembershipModal({ isOpen, onClose, plans }: { isOpen: boolean, onClose: () => void, plans: Plan[] }) {
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
                            <p className="text-sm text-gray-500 font-medium">Estás a un paso de ser Socio PRO. Total: <span className="text-gray-900 font-black">RD$ {selectedPlan.price.toLocaleString()}</span></p>
                        </div>

                        <form onSubmit={handlePayment} className="space-y-4">
                            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 block">Número de Tarjeta</label>
                                    <div className="relative">
                                        <input required type="text" placeholder="#### #### #### ####" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 font-mono text-lg font-bold focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1">
                                            <div className="w-8 h-5 bg-gray-200 rounded"></div>
                                            <div className="w-8 h-5 bg-gray-300 rounded"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 block">Vencimiento</label>
                                        <input required type="text" placeholder="MM / AA" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 font-mono text-lg font-bold focus:ring-2 focus:ring-primary outline-none transition-all" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 block">CVC</label>
                                        <input required type="text" placeholder="123" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 font-mono text-lg font-bold focus:ring-2 focus:ring-primary outline-none transition-all" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-blue-50/50 rounded-xl">
                                <span className="text-blue-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                                    </svg>
                                </span>
                                <p className="text-[10px] text-blue-600 font-bold leading-tight">Tu información está encriptada con tecnología SSL de 256 bits. Explorar RD no almacena datos de tu tarjeta.</p>
                            </div>

                            <button
                                disabled={isProcessing}
                                className="w-full py-4 bg-primary text-white font-black text-lg rounded-2xl hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {isProcessing ? (
                                    <>
                                        <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Procesando Pago...
                                    </>
                                ) : `Completar Pago de RD$ ${selectedPlan.price.toLocaleString()}`}
                            </button>
                        </form>
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
