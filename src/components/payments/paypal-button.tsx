
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
    onSuccess?: (details: any) => void;
    onError?: (error: any) => void;
}

export const PayPalPaymentButton = ({
    amount,
    currency = "USD",
    description,
    metadata,
    onSuccess,
    onError
}: PayPalButtonProps) => {
    const [isLoaded, setIsLoaded] = useState(false);

    // Replace with your actual PayPal Client ID (Sandbox or Live)
    // IMPORTANT: For production, use environment variable: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test";

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
                        forceReRender={[amount, currency]}
                        createOrder={(data, actions) => {
                            return actions.order.create({
                                intent: "CAPTURE",
                                purchase_units: [
                                    {
                                        amount: {
                                            value: amount.toString(),
                                            currency_code: currency
                                        },
                                        description: description,
                                        custom_id: JSON.stringify(metadata)
                                    },
                                ],
                                payment_source: {
                                    paypal: {
                                        experience_context: {
                                            brand_name: "ExplorarRD",
                                            user_action: "PAY_NOW",
                                            shipping_preference: "NO_SHIPPING",
                                            landing_page: "LOGIN"
                                        }
                                    }
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
                            }
                        }}
                        onError={(err) => {
                            console.error("PayPal Error", err);
                            if (onError) onError(err);
                            toast.error("Ocurrió un error con PayPal.");
                        }}
                    />
                </div>
            </PayPalScriptProvider>
        </div>
    );
};
