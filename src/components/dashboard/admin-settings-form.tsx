'use client';

import { useState } from 'react';
import { updatePlanPrice } from '@/lib/admin-actions';
import { useRouter } from 'next/navigation';

interface Plan {
    id: string;
    slug: string;
    name: string;
    price: number;
    type: string;
    description: string | null;
}

export default function AdminSettingsForm({ plans }: { plans: Plan[] }) {
    const [editing, setEditing] = useState<string | null>(null);
    const [tempPrice, setTempPrice] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleEdit = (plan: Plan) => {
        setEditing(plan.slug);
        setTempPrice(plan.price);
    };

    const handleSave = async (slug: string) => {
        setLoading(true);
        const res = await updatePlanPrice(slug, tempPrice);
        setEditing(null);
        setLoading(false);
        if (res.success) {
            router.refresh();
        } else {
            alert(res.error);
        }
    };

    const adPlans = plans.filter(p => p.type === 'AD');
    const memberPlans = plans.filter(p => p.type === 'MEMBERSHIP');

    return (
        <div className="space-y-10">
            {/* Header info */}
            <div className="bg-blue-600 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                <div className="relative z-10">
                    <h2 className="text-3xl font-black tracking-tight mb-2">Editor Maestro de Precios 💰</h2>
                    <p className="text-blue-100 max-w-xl">Desde aquí gestionas cuánto pagan las agencias por destacar sus tours o por su membresía PRO. Los cambios son instantáneos.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-white">
                {/* Ad Plans */}
                <div className="bg-gray-900 rounded-3xl shadow-xl overflow-hidden border border-gray-800">
                    <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
                        <div>
                            <h3 className="text-xl font-bold">📢 Anuncios (Ads)</h3>
                            <p className="text-sm text-gray-500">Pagos por destacar tours individuales.</p>
                        </div>
                        <span className="bg-primary/20 text-primary text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest">Revenue Model</span>
                    </div>
                    <div className="p-6 space-y-6">
                        {adPlans.map(plan => (
                            <PlanEditItem
                                key={plan.id}
                                plan={plan}
                                isEditing={editing === plan.slug}
                                tempPrice={tempPrice}
                                onTempPriceChange={setTempPrice}
                                onEdit={() => handleEdit(plan)}
                                onSave={() => handleSave(plan.slug)}
                                onCancel={() => setEditing(null)}
                                loading={loading}
                            />
                        ))}
                    </div>
                </div>

                {/* Membership Plans */}
                <div className="bg-gray-900 rounded-3xl shadow-xl overflow-hidden border border-gray-800">
                    <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
                        <div>
                            <h3 className="text-xl font-bold">💎 Membresías (Pro)</h3>
                            <p className="text-sm text-gray-500">Suscripciones de agencias de viaje.</p>
                        </div>
                        <span className="bg-teal-500/20 text-teal-500 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest">SaaS Model</span>
                    </div>
                    <div className="p-6 space-y-6">
                        {memberPlans.map(plan => (
                            <PlanEditItem
                                key={plan.id}
                                plan={plan}
                                isEditing={editing === plan.slug}
                                tempPrice={tempPrice}
                                onTempPriceChange={setTempPrice}
                                onEdit={() => handleEdit(plan)}
                                onSave={() => handleSave(plan.slug)}
                                onCancel={() => setEditing(null)}
                                loading={loading}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl flex gap-4">
                <span className="text-2xl">⚠️</span>
                <div>
                    <h4 className="font-bold text-amber-800">Nota de Seguridad</h4>
                    <p className="text-sm text-amber-700">Cambiar los precios afectará solo a los nuevos cobros. Los planes ya vendidos mantendrán su vigencia original. Asegúrate de comunicar cambios de precio masivos a tus socios.</p>
                </div>
            </div>
        </div>
    );
}

function PlanEditItem({ plan, isEditing, tempPrice, onTempPriceChange, onEdit, onSave, onCancel, loading }: any) {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group">
            <div className="flex-1">
                <h4 className="font-bold text-white group-hover:text-primary transition-colors">{plan.name}</h4>
                <p className="text-xs text-gray-500 leading-tight mt-0.5">{plan.description}</p>
                <div className="mt-2 inline-block px-2 py-0.5 bg-gray-800 rounded text-[10px] font-mono text-gray-400">slug: {plan.slug}</div>
            </div>

            <div className="flex items-center gap-3">
                {isEditing ? (
                    <div className="flex items-center gap-2 animate-in fade-in zoom-in duration-200">
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">RD$</span>
                            <input
                                autoFocus
                                type="number"
                                value={tempPrice}
                                onChange={(e) => onTempPriceChange(Number(e.target.value))}
                                className="bg-gray-800 border-2 border-primary rounded-xl pl-12 pr-3 py-2 w-36 text-right font-black text-white focus:outline-none"
                            />
                        </div>
                        <button
                            onClick={onSave}
                            disabled={loading}
                            className="bg-primary text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-primary-dark transition-all disabled:opacity-50"
                        >
                            {loading ? '...' : 'Poner Precio'}
                        </button>
                        <button
                            onClick={onCancel}
                            className="bg-gray-800 text-gray-400 px-3 py-2 rounded-xl text-xs font-bold hover:bg-gray-700 transition-all"
                        >
                            ✕
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-end">
                        <div className="flex items-baseline gap-1">
                            <span className="text-xs font-bold text-primary">RD$</span>
                            <span className="text-3xl font-black text-white leading-none tracking-tighter">{plan.price.toLocaleString()}</span>
                        </div>
                        <button
                            onClick={onEdit}
                            className="mt-1 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-primary transition-colors"
                        >
                            [ Editar ]
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
