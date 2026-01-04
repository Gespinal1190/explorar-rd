import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import AdminBookingList from "@/components/admin/admin-booking-list";

export default async function AdminBookingsPage() {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
        redirect("/dashboard");
    }

    const bookings = await prisma.booking.findMany({
        include: {
            user: true,
            tour: {
                include: { agency: true }
            }
        },
        orderBy: { createdAt: 'desc' },
        take: 100 // Limit to last 100 for performance
    });

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
