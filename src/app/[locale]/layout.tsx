import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
});

export const metadata: Metadata = {
    title: {
        template: '%s | DescubreRD',
        default: 'DescubreRD | Turismo Interno República Dominicana',
    },
    description: "Descubre las mejores excursiones y destinos en República Dominicana. Reserva online con agencias locales verificadas.",
};

export default async function LocaleLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    if (!['es', 'en', 'fr'].includes(locale)) {
        notFound();
    }

    const messages = await getMessages();

    return (
        <html lang={locale}>
            <body className={`${inter.variable} font-sans antialiased text-gray-900 bg-[#FBFBF8]`}>
                <NextIntlClientProvider messages={messages}>
                    <AuthProvider>
                        {children}
                    </AuthProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
