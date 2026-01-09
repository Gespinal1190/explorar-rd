'use client';

import { useState } from 'react';
import { Link } from "@/navigation";
import PromoteModal from "@/components/dashboard/promote-modal";
import { toggleTourStatus, deleteTour } from "@/lib/actions";
import { useTranslations } from "next-intl";

interface Tour {
    id: string;
    title: string;
    location: string;
    price: number;
    currency?: string;
    featuredExpiresAt?: Date | string | null;
    status: string; // Added status
}

export default function AgencyToursList({ tours, plans, agencyId }: { tours: Tour[], plans: any[], agencyId: string }) {
    const t = useTranslations("AgencyTours");
    const [promoteId, setPromoteId] = useState<string | null>(null);
    const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());

    const handleToggleStatus = async (tourId: string, currentStatus: string) => {
        setLoadingIds(prev => new Set(prev).add(tourId));
        await toggleTourStatus(tourId, currentStatus);
        setLoadingIds(prev => {
            const next = new Set(prev);
            next.delete(tourId);
            return next;
        });
    };

    return (
        <div className="space-y-6">
            {/* Desktop View (Table) */}
            <div className="hidden md:block bg-white rounded-xl shadow-sm border overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">{t('table.title')}</th>
                            <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">{t('table.location')}</th>
                            <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">{t('table.price')}</th>
                            <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                                {t('table.status')}
                                <span className="text-[10px] text-gray-300 font-normal cursor-help" title={t('status.toolTip') || "Pausar no elimina tu tour"}>ℹ️</span>
                            </th>
                            <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase text-right">{t('table.actions')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {tours.map((tour) => {
                            const isFeatured = tour.featuredExpiresAt && new Date(tour.featuredExpiresAt) > new Date();
                            const isPaused = tour.status === 'PAUSED';
                            const isLoading = loadingIds.has(tour.id);

                            return (
                                <tr key={tour.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className={`font-medium ${isPaused ? 'text-gray-400' : 'text-gray-900'}`}>{tour.title}</span>
                                            {isFeatured && (
                                                <span className="text-[10px] text-amber-600 font-bold flex items-center gap-1 mt-1">
                                                    {t('status.featured')}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-sm">{tour.location}</td>
                                    <td className="px-6 py-4 text-gray-900 font-bold text-sm">
                                        {tour.currency === 'USD' ? 'USD$' : tour.currency === 'EUR' ? '€' : 'RD$'} {tour.price.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${isPaused ? 'bg-gray-100 text-gray-800 border-gray-200' : 'bg-green-100 text-green-800 border-green-200'}`}>
                                            {isPaused ? t('status.paused') : t('status.active')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-3">
                                            <button
                                                onClick={() => handleToggleStatus(tour.id, tour.status)}
                                                disabled={isLoading}
                                                className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${isPaused ? 'text-green-600 border-green-200 bg-green-50 hover:bg-green-100' : 'text-gray-500 border-gray-200 hover:bg-gray-100'}`}
                                            >
                                                {isLoading ? '...' : isPaused ? t('actions.activate') : t('actions.pause')}
                                            </button>

                                            <div className="h-4 w-px bg-gray-200"></div>

                                            <button
                                                onClick={() => setPromoteId(tour.id)}
                                                className="text-amber-600 hover:text-amber-700 text-xs font-bold"
                                                title={t('actions.promote')}
                                            >
                                                {t('actions.promote')}
                                            </button>
                                            <Link href={`/dashboard/agency/tours/${tour.id}/edit`} className="text-blue-600 hover:text-blue-800 text-xs font-bold">
                                                {t('actions.edit')}
                                            </Link>

                                            <div className="h-4 w-px bg-gray-200"></div>

                                            <button
                                                onClick={async () => {
                                                    if (confirm(t('actions.deleteConfirm'))) {
                                                        await deleteTour(tour.id);
                                                    }
                                                }}
                                                className="text-gray-400 hover:text-red-600 text-[10px] font-bold opacity-60 hover:opacity-100 transition-all flex items-center gap-1 group"
                                                title={t('actions.delete')}
                                            >
                                                <span className="group-hover:scale-110 transition-transform">🗑️</span>
                                                {t('actions.delete')}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Mobile View (Cards) */}
            <div className="md:hidden space-y-4">
                {tours.map((tour) => {
                    const isFeatured = tour.featuredExpiresAt && new Date(tour.featuredExpiresAt) > new Date();
                    const isPaused = tour.status === 'PAUSED';
                    const isLoading = loadingIds.has(tour.id);

                    return (
                        <div key={tour.id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className={`font-bold text-gray-900 ${isPaused ? 'text-gray-400' : ''}`}>{tour.title}</h3>
                                    <p className="text-sm text-gray-500">{tour.location}</p>
                                </div>
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wide ${isPaused ? 'bg-gray-100 text-gray-600 border-gray-200' : 'bg-green-100 text-green-700 border-green-200'}`}>
                                    {isPaused ? t('status.pausedLabel') : t('status.activeLabel')}
                                </span>
                            </div>

                            <div className="flex items-center gap-4 text-sm">
                                <span className="font-bold text-gray-900 bg-gray-50 px-3 py-1 rounded-lg">
                                    {tour.currency === 'USD' ? 'USD$' : tour.currency === 'EUR' ? '€' : 'RD$'} {tour.price.toLocaleString()}
                                </span>
                                {isFeatured && (
                                    <span className="text-[10px] text-amber-600 font-bold flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg border border-amber-100">
                                        {t('status.featured')}
                                    </span>
                                )}
                            </div>

                            <div className="border-t border-gray-50 pt-4 flex items-center justify-between gap-3">
                                <button
                                    onClick={() => handleToggleStatus(tour.id, tour.status)}
                                    disabled={isLoading}
                                    className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-colors ${isPaused ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-600 border-gray-200'}`}
                                >
                                    {isLoading ? '...' : isPaused ? t('actions.activate') : t('actions.pause')}
                                </button>
                                <button
                                    onClick={() => setPromoteId(tour.id)}
                                    className="flex-1 py-2 rounded-lg text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors"
                                >
                                    🚀 {t('actions.promote')}
                                </button>
                                <Link
                                    href={`/dashboard/agency/tours/${tour.id}/edit`}
                                    className="flex-1 py-2 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 text-center hover:bg-blue-100 transition-colors"
                                >
                                    ✏️ {t('actions.edit')}
                                </Link>
                                <button
                                    onClick={async () => {
                                        if (confirm(t('actions.deleteConfirm'))) {
                                            await deleteTour(tour.id);
                                        }
                                    }}
                                    className="py-2 px-3 rounded-lg text-xs font-bold bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-colors"
                                    title={t('actions.delete')}
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Optimized Empty State */}
            {tours.length === 0 && (
                <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-gray-200">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                        🧭
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{t('empty.title')}</h3>
                    <p className="text-gray-500 mb-6 max-w-sm mx-auto">{t('empty.desc')}</p>
                    <Link
                        href="/dashboard/agency/tours/new"
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    >
                        <span>✨</span>
                        {t('empty.create')}
                    </Link>
                </div>
            )}

            {promoteId && (
                <PromoteModal
                    tourId={promoteId}
                    isOpen={!!promoteId}
                    onClose={() => setPromoteId(null)}
                    plans={plans}
                    agencyId={agencyId}
                />
            )}
        </div>
    );
}

