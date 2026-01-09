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
    template: '%s | DescubreRD',
    default: 'DescubreRD | Turismo Interno República Dominicana',
  },
  description: "Descubre las mejores excursiones y destinos en República Dominicana. Reserva online con agencias locales verificadas.",
  keywords: ["Turismo Interno", "República Dominicana", "Excursiones", "Punta Cana", "Samaná", "Tours"],
  openGraph: {
    title: 'DescubreRD | Turismo Interno',
    description: 'Conecta con agencias locales y descubre el verdadero paraíso dominicano.',
    url: 'https://descubrerd.com',
    siteName: 'DescubreRD',
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
    title: 'DescubreRD',
    description: 'Turismo interno de calidad en República Dominicana.',
    images: ['/images/hero-bg.jpg'],
  },
};

import { AuthProvider } from "@/contexts/AuthContext";

// ... (Metadata stays here)

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} font-sans antialiased text-gray-900 bg-[#FBFBF8]`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
