import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Link, redirect } from "@/navigation";
import BookingCard from "@/components/user/booking-card";
import { getTranslations } from "next-intl/server";

export default async function UserBookingsPage(props: { params: Promise<{ locale: string }> }) {
    const { locale } = await props.params;
    const session = await auth();
    const t = await getTranslations("UserBookings");

    const userId = session?.user?.id;

    if (!userId) {
        redirect({ href: "/login", locale });
        return null;
    }

    let bookings = [];

    try {
        bookings = await prisma.booking.findMany({
            where: { userId: userId },
            include: {
                tour: {
                    include: {
                        agency: {
                            include: { bankAccounts: true }
                        },
                        images: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    } catch (error) {
        console.error("Error fetching bookings (Schema Mismatch):", error);
        return (
            <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center space-y-4">
                <div className="text-4xl">🛠️</div>
                <h1 className="text-xl font-bold text-gray-900">Actualización de Sistema Requerida</h1>
                <p className="text-gray-600 max-w-md">
                    Se han detectado cambios recientes en la base de datos que requieren un reinicio del servidor de desarrollo.
                </p>
                <div className="bg-gray-900 text-white p-4 rounded-xl font-mono text-sm text-left">
                    <p className="opacity-50 mb-2">// En tu terminal:</p>
                    <p>1. Presiona <span className="text-yellow-400">Ctrl + C</span> para detener</p>
                    <p>2. Ejecuta: <span className="text-green-400">npx prisma generate</span></p>
                    <p>3. Ejecuta: <span className="text-blue-400">npm run dev</span></p>
                </div>
            </div>
        );
    }

    // Handle date serialization
    const serializedBookings = JSON.parse(JSON.stringify(bookings));

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
            {bookings.length === 0 ? (
                <div className="bg-white p-12 rounded-3xl text-center border border-gray-100">
                    <div className="text-4xl mb-4">🧐</div>
                    <h3 className="text-lg font-bold text-gray-900">{t('empty.title')}</h3>
                    <p className="text-gray-500 mb-6">{t('empty.desc')}</p>
                    <Link href="/tours" className="px-6 py-2 bg-gray-900 text-white font-bold rounded-full">{t('empty.explore')}</Link>
                </div>
            ) : (
                serializedBookings.map((booking: any) => (
                    <BookingCard key={booking.id} booking={booking} />
                ))
            )}
        </div>
    );
}




