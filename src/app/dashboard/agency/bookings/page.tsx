import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import BookingList from "@/components/agency/booking-list";

export default async function AgencyBookingsPage() {
    const session = await auth();
    if (!session?.user?.id) return null;

    const agency = await prisma.agencyProfile.findUnique({
        where: { userId: session.user.id },
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

