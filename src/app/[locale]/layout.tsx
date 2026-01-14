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

    // SEO translated content
    const content = {
        es: {
            title: 'DescubreRD | Tours y excursiones en República Dominicana',
            description: 'DescubreRD: tours y excursiones auténticas en República Dominicana con agencias locales verificadas. Reserva experiencias únicas.'
        },
        en: {
            title: 'Tours and Excursions in Dominican Republic | DescubreRD',
            description: 'Discover and book the best tours and excursions in Dominican Republic. Punta Cana, Samana, Santo Domingo and more, with verified local agencies.'
        },
        fr: {
            title: 'Tours et Excursions en République Dominicaine | DescubreRD',
            description: 'Découvrez et réservez les mejores tours et excursions en République Dominicaine. Punta Cana, Samaná, Saint-Domingue et plus, avec des agences locales vérifiées.'
        }
    }[locale as 'es' | 'en' | 'fr'] || {
        title: 'Tours y excursiones en República Dominicana | DescubreRD',
        description: 'Descubre y reserva los mejores tours y excursiones en República Dominicana.'
    };

    return {
        metadataBase: new URL(baseUrl),
        title: {
            template: '%s | DescubreRD',
            default: content.title,
        },
        description: content.description,
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
        viewport: {
            width: 'device-width',
            initialScale: 1,
            maximumScale: 5,
        },
        themeColor: '#000000',
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

    // JSON-LD Schema
    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Organization',
                '@id': 'https://descubrerd.app/#organization',
                name: 'DescubreRD',
                url: 'https://descubrerd.app',
                logo: {
                    '@type': 'ImageObject',
                    url: 'https://descubrerd.app/logo.png',
                    width: '512',
                    height: '512'
                },
                sameAs: [
                    'https://www.instagram.com/descubrerd.app', // Placeholder - actual values requested from user
                    'https://www.facebook.com/descubrerd.app'
                ],
                contactPoint: {
                    '@type': 'ContactPoint',
                    contactType: 'customer support',
                    email: 'info@descubrerd.app'
                }
            },
            {
                '@type': 'WebSite',
                '@id': 'https://descubrerd.app/#website',
                url: 'https://descubrerd.app',
                name: 'DescubreRD',
                description: 'Tours y excursiones en República Dominicana',
                publisher: { '@id': 'https://descubrerd.app/#organization' },
                potentialAction: {
                    '@type': 'SearchAction',
                    target: {
                        '@type': 'EntryPoint',
                        urlTemplate: 'https://descubrerd.app/es/tours?search={search_term_string}'
                    },
                    'query-input': 'required name=search_term_string'
                },
                inLanguage: locale
            }
        ]
    };

    return (
        <html lang={locale}>
            <head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
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
