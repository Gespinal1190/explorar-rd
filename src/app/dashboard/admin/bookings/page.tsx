import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import AdminBookingList from "@/components/admin/admin-booking-list";

export default async function AdminBookingsPage() {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
        redirect("/dashboard");
    }

    let bookings = [];
    try {
        bookings = await prisma.booking.findMany({
            include: {
                user: true,
                tour: {
                    include: { agency: true }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: 100 // Limit to last 100 for performance
        });
    } catch (error) {
        console.error("Admin bookings error:", error);
        return <div className="p-8 text-center text-red-500 bg-red-50 rounded-2xl border border-red-100">
            Error al cargar las reservas. Por favor contacte soporte.
        </div>;
    }

    // Serialize dates
    const serializedBookings = JSON.parse(JSON.stringify(bookings));

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-black text-gray-900">Gestión de Reservas</h1>
            <p className="text-gray-500">Administra todas las reservas de la plataforma.</p>

            <AdminBookingList bookings={serializedBookings} />
        </div>
    );
}
