import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: '%s | Explorar RD',
    default: 'Explorar RD | Turismo Interno República Dominicana',
  },
  description: "Descubre las mejores excursiones y destinos en República Dominicana. Reserva online con agencias locales verificadas.",
  keywords: ["Turismo Interno", "República Dominicana", "Excursiones", "Punta Cana", "Samaná", "Tours"],
  openGraph: {
    title: 'Explorar RD | Turismo Interno',
    description: 'Conecta con agencias locales y descubre el verdadero paraíso dominicano.',
    url: 'https://explorard.com',
    siteName: 'Explorar RD',
    images: [
      {
        url: '/images/hero-bg.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'es_DO',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Explorar RD',
    description: 'Turismo interno de calidad en República Dominicana.',
    images: ['/images/hero-bg.jpg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} font-sans antialiased text-gray-900 bg-[#FBFBF8]`}>
        {children}
      </body>
    </html>
  );
}
