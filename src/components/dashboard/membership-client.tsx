'use client';

import { useState } from 'react';
import MembershipModal from './membership-modal';

interface Agency {
    id: string;
    tier: string;
    tierExpiresAt: Date | string | null;
}

interface Plan {
    id: string;
    slug: string;
    name: string;
    price: number;
    description: string | null;
    features: string | null;
}

export default function MembershipClient({ agency, plans }: { agency: Agency, plans: Plan[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const isPro = agency.tier === 'PRO' && agency.tierExpiresAt && new Date(agency.tierExpiresAt) > new Date();

    return (
        <div className="space-y-10">
            {/* Current Status Header */}
            <div className="relative overflow-hidden bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/5 rounded-full -ml-32 -mb-32 blur-3xl"></div>

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="text-center md:text-left">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Estado de tu Cuenta</p>
                        <div className="flex flex-col md:flex-row items-center gap-4">
                            <h2 className={`text-4xl md:text-5xl font-black tracking-tighter ${isPro ? 'text-primary' : 'text-gray-300'}`}>
                                {isPro ? 'Socio PRO 💎' : 'Socio Estándar 🥥'}
                            </h2>
                            {isPro && (
                                <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold bg-green-100 text-green-700 border border-green-200">
                                    <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                                    Suscripción Activa
                                </span>
                            )}
                        </div>
                        {isPro && agency.tierExpiresAt && (
                            <p className="text-sm text-gray-500 mt-4 flex items-center justify-center md:justify-start gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-primary">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                                </svg>
                                Próxima renovación: <span className="font-bold">{new Date(agency.tierExpiresAt).toLocaleDateString('es-DO', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                            </p>
                        )}
                        {!isPro && (
                            <p className="text-gray-500 mt-4">Actualiza tu cuenta para desbloquear herramientas exclusivas y vender más.</p>
                        )}
                    </div>

                    {!isPro && (
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="group relative px-10 py-5 bg-primary text-white font-black rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-primary/30 overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center gap-2 text-lg">
                                🚀 ¡IMPULSA MI AGENCIA!
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                        </button>
                    )}
                </div>
            </div>

            {/* Why Go Pro Section */}
            <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">¿Por qué ser un Socio PRO?</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <BenefitCard
                        icon="✨"
                        title="Prioridad Total"
                        description="Tus excursiones aparecerán por encima de las estándar en los resultados de búsqueda."
                    />
                    <BenefitCard
                        icon="🛡️"
                        title="Sello de Confianza"
                        description="Insignia azul de socio certificado que aumenta la tasa de conversión de tus tours."
                    />
                    <BenefitCard
                        icon="💸"
                        title="Cero Comisiones"
                        description="Mantén el 100% de tus ingresos. No cobramos cargos extras por reserva a los socios Pro."
                    />
                    <BenefitCard
                        icon="📱"
                        title="WhatsApp Directo"
                        description="Botón de contacto directo resaltado para que los clientes te escriban sin esperas."
                    />
                    <BenefitCard
                        icon="📊"
                        title="Panel Avanzado"
                        description="Acceso a analíticas detalladas de cuánta gente ve y guarda tus tours."
                    />
                    <BenefitCard
                        icon="🎧"
                        title="Gestor Dedicado"
                        description="Soporte VIP 24/7 para ayudarte a configurar tus tours y resolver dudas."
                    />
                </div>
            </div>

            {/* Plan Cards Display (Horizontal) */}
            <div className="bg-gray-100 p-8 rounded-3xl">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <span className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">💳</span>
                    Planes Disponibles
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {plans.map(plan => {
                        const features = plan.features ? JSON.parse(plan.features) : [];
                        return (
                            <div key={plan.id} className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:border-primary/30 transition-colors flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h4 className="text-xl font-black text-gray-900">{plan.name}</h4>
                                        <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-baseline gap-1 text-primary">
                                            <span className="text-xs font-bold uppercase">RD$</span>
                                            <span className="text-3xl font-black tracking-tighter">{plan.price.toLocaleString()}</span>
                                        </div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{plan.slug.includes('1y') ? 'Por Año' : 'Por Mes'}</p>
                                    </div>
                                </div>
                                <div className="space-y-3 mb-8 flex-1">
                                    {features.map((f: string, idx: number) => (
                                        <div key={idx} className="flex items-start gap-2 text-sm text-gray-600 font-medium">
                                            <span className="text-primary mt-0.5">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4.13-5.69Z" clipRule="evenodd" />
                                                </svg>
                                            </span>
                                            {f}
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="w-full py-3 rounded-xl bg-gray-900 text-white font-bold hover:bg-black transition-all active:scale-95"
                                >
                                    Seleccionar Plan
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            <MembershipModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                plans={plans}
                agencyId={agency.id}
            />
        </div>
    );
}

function BenefitCard({ icon, title, description }: { icon: string, title: string, description: string }) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-4">{icon}</div>
            <h4 className="font-bold text-gray-900 mb-2">{title}</h4>
            <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
        </div>
    );
}
