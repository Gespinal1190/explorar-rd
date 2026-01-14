"use client";

import { useState } from "react";
import { toast } from "sonner";
import { updateAgencyPaymentSettings } from "@/lib/admin-actions";

interface AgencyPaymentFormProps {
    agency: {
        id: string;
        paypalEmail: string | null;
        paypalMeLink: string | null;
        commissionRate: number;
    };
}

export function AgencyPaymentForm({ agency }: AgencyPaymentFormProps) {
    const [isPending, setIsPending] = useState(false);

    const handleSubmit = async (formData: FormData) => {
        setIsPending(true);
        try {
            const result = await updateAgencyPaymentSettings(agency.id, formData);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success(result.message || "Configuración actualizada");
            }
        } catch (err) {
            console.error(err);
            toast.error("Ocurrió un error inesperado");
        } finally {
            setIsPending(false);
        }
    };

    return (
        <form action={handleSubmit} className="space-y-4">
            <div>
                <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Email de PayPal (Pagos Directos)</label>
                <input
                    name="paypalEmail"
                    defaultValue={agency.paypalEmail || ''}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="ejemplo@agencia.com"
                />
                <p className="text-xs text-gray-500 mt-1">Este email recibirá los pagos directamente de los clientes.</p>
            </div>
            <div>
                <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Enlace PayPal.Me (Respaldo)</label>
                <input
                    name="paypalMeLink"
                    defaultValue={agency.paypalMeLink || ''}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="https://paypal.me/usuario"
                />
                <p className="text-xs text-gray-500 mt-1">Se muestra automáticamente si falla el botón de pago.</p>
            </div>
            <div>
                <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Comisión de Plataforma (%)</label>
                <input
                    name="commissionRate"
                    type="number"
                    step="0.1"
                    defaultValue={agency.commissionRate || 0}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <p className="text-xs text-gray-500 mt-1">Porcentaje para reportes (no se descuenta automáticamente).</p>
            </div>
            <button
                type="submit"
                disabled={isPending}
                className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isPending ? "Guardando..." : "Guardar Configuración de Pagos"}
            </button>
        </form>
    );
}
