import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import BookingList from "@/components/agency/booking-list";

export default async function AgencyBookingsPage() {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) return null;

    let agency;
    try {
        agency = await prisma.agencyProfile.findUnique({
            where: { userId: userId },
            include: {
                tours: {
                    include: {
                        bookings: {
                            include: { user: true }
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error("Agency bookings error:", error);
        return <div className="p-8 text-center text-red-500 bg-red-50 rounded-2xl">
            Error al cargar tus reservas. Revisa tu conexión o intenta más tarde.
        </div>;
    }

    if (!agency) return <div>No tienes perfil de agencia.</div>;

    // Flatten bookings
    const bookings = agency.tours.flatMap(tour =>
        tour.bookings.map(booking => ({
            ...booking,
            tourTitle: tour.title
        }))
    ).sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Serialize to handle Date objects passed to Client Component
    const serializedBookings = JSON.parse(JSON.stringify(bookings));

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Reservas Recibidas</h1>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <BookingList bookings={serializedBookings} />
            </div>
        </div>
    );
}

