
"use client";

import { useEffect, useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { toast } from "sonner";
import { useRouter } from "@/navigation";

interface PayPalButtonProps {
    amount: number;
    currency?: string;
    description?: string;
    metadata?: any;
    payeeEmail?: string | null;
    paypalMeLink?: string | null;
    onSuccess?: (details: any) => void;
    onError?: (error: any) => void;
}

export const PayPalPaymentButton = ({
    amount,
    currency = "USD",
    description,
    metadata,
    onSuccess,
    onError,
    payeeEmail,
    paypalMeLink
}: PayPalButtonProps) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [showFallback, setShowFallback] = useState(false);

    // Replace with your actual PayPal Client ID (Sandbox or Live)
    // IMPORTANT: For production, use environment variable: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test";

    if (showFallback && paypalMeLink) {
        return (
            <div className="w-full max-w-md mx-auto text-center p-6 bg-yellow-50 border border-yellow-200 rounded-xl">
                <p className="text-sm text-yellow-800 mb-4 font-bold">
                    ⚠️ El botón automático tuvo un problema.
                </p>
                <p className="text-sm text-gray-600 mb-4">
                    Por favor, utiliza este enlace seguro de respaldo para pagar directamente a la agencia:
                </p>
                <a
                    href={paypalMeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-[#003087] text-white font-bold py-3 px-6 rounded-full hover:bg-[#001c64] transition-colors"
                >
                    Pagar vía PayPal.Me 👉
                </a>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md mx-auto">
            <PayPalScriptProvider options={{
                "clientId": clientId,
                currency: currency,
                intent: "capture",
                commit: true
            }}>
                <div className="relative z-0">
                    <PayPalButtons
                        style={{
                            layout: "vertical",
                            color: "gold",
                            shape: "rect",
                            label: "pay"
                        }}
                        forceReRender={[amount, currency, payeeEmail]}
                        createOrder={(data, actions) => {
                            const purchaseUnit: any = {
                                amount: {
                                    value: parseFloat(amount.toString()).toFixed(2),
                                    currency_code: currency
                                },
                                description: description,
                                custom_id: JSON.stringify(metadata)
                            };

                            if (payeeEmail) {
                                purchaseUnit.payee = { email_address: payeeEmail };
                            }

                            return actions.order.create({
                                intent: "CAPTURE",
                                purchase_units: [purchaseUnit],
                                application_context: {
                                    brand_name: "DescubreRD",
                                    user_action: "PAY_NOW",
                                    shipping_preference: "NO_SHIPPING"
                                }
                            });
                        }}
                        onApprove={async (data, actions) => {
                            if (!actions.order) return;
                            try {
                                const details = await actions.order.capture();
                                // Call backend to verify and record transaction
                                if (onSuccess) onSuccess(details);
                            } catch (err) {
                                console.error("PayPal Capture Error", err);
                                if (onError) onError(err);
                                toast.error("Error al procesar el pago. Intente nuevamente.");
                                setShowFallback(true);
                            }
                        }}
                        onError={(err) => {
                            console.error("PayPal Error", err);
                            if (onError) onError(err);
                            toast.error("Ocurrió un error con PayPal.");
                            setShowFallback(true);
                        }}
                    />
                </div>
            </PayPalScriptProvider>
        </div>
    );
};
