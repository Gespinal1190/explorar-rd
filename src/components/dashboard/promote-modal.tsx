'use client';

import { useState } from 'react';
import { promoteTour } from '@/lib/promote-actions';
import { useRouter } from 'next/navigation';

interface Plan {
    id: string;
    slug: string;
    name: string;
    price: number;
    description: string | null;
}

export default function PromoteModal({ tourId, isOpen, onClose, plans }: { tourId: string, isOpen: boolean, onClose: () => void, plans?: Plan[] }) {
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const router = useRouter();

    if (!isOpen) return null;

    // Fallback if no plans passed (should not happen if flow works)
    const displayPlans = plans || [];

    const handlePayment = async () => {
        if (!selectedPlan) return;
        setIsProcessing(true);

        // Mock Payment Delay
        setTimeout(async () => {
            const result = await promoteTour(tourId, selectedPlan);
            setIsProcessing(false);
            if (result.success) {
                onClose();
                router.refresh();
                alert("¡Tour promocionado exitosamente! Ahora aparecerá en la sección de Destacados.");
            } else {
                alert(result.error || "Ocurrió un error al procesar la promoción.");
            }
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden">
                <div className="p-6 border-b">
                    <h2 className="text-xl font-bold text-gray-900">🚀 Destacar mi Anuncio</h2>
                    <p className="text-sm text-gray-500 mt-1">Aumenta la visibilidad y recibe más clientes.</p>
                </div>

                <div className="p-6 space-y-4">
                    {displayPlans.length === 0 && <p>No hay planes de promoción activos.</p>}

                    {displayPlans.map(plan => (
                        <div
                            key={plan.id}
                            onClick={() => setSelectedPlan(plan.slug)}
                            className={`border-2 rounded-xl p-4 cursor-pointer transition-all hover:border-primary/50 relative ${selectedPlan === plan.slug ? 'border-primary bg-primary/5' : 'border-gray-200'}`}
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-gray-900">{plan.name}</h3>
                                    <p className="text-xs text-gray-500">{plan.description}</p>
                                </div>
                                <span className="font-bold text-lg">RD$ {plan.price.toLocaleString()}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-6 bg-gray-50 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-200 rounded-lg transition-colors"
                        disabled={isProcessing}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handlePayment}
                        disabled={!selectedPlan || isProcessing}
                        className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-all disabled:opacity-50 shadow-md flex items-center gap-2"
                    >
                        {isProcessing ? 'Procesando...' : 'Pagar y Activar'}
                    </button>
                </div>
            </div>
        </div>
    );
}
