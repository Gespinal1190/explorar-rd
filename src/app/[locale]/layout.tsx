import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Script from 'next/script';


const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
});

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const baseUrl = 'https://descubrerd.app';
    const canonicalUrl = `${baseUrl}/${locale}`;

    return {
        metadataBase: new URL(baseUrl),
        title: {
            template: '%s | DescubreRD',
            default: 'Tours y excursiones en República Dominicana | DescubreRD',
        },
        description: "Descubre y reserva los mejores tours y excursiones en República Dominicana. Punta Cana, Samaná, Santo Domingo y más, con agencias locales verificadas.",
        alternates: {
            canonical: canonicalUrl,
            languages: {
                'es': `${baseUrl}/es`,
                'en': `${baseUrl}/en`,
                'fr': `${baseUrl}/fr`,
                'x-default': baseUrl,
            },
        },
        icons: {
            icon: [
                { url: '/favicon.png', type: 'image/png' },
                { url: '/icon.png', type: 'image/png' },
            ],
            shortcut: '/favicon.png',
            apple: '/apple-touch-icon.png',
        },
    };
}

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
            <head>
                {/* Google tag (gtag.js) */}
                <Script
                    async
                    src="https://www.googletagmanager.com/gtag/js?id=AW-17869765517"
                    strategy="afterInteractive"
                />
                <Script id="google-ads-tag" strategy="afterInteractive">
                    {`
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', 'AW-17869765517');
                    `}
                </Script>
            </head>
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
