import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import AgencyToursList from "@/components/dashboard/agency-tours-list";
import { getPlans } from "@/lib/plans";

export default async function AgencyToursPage() {
    const session = await auth();
    if (!session?.user?.id) return null;

    const [agency, plans] = await Promise.all([
        prisma.agencyProfile.findUnique({
            where: { userId: session.user.id },
            include: { tours: true }
        }),
        getPlans('AD')
    ]);

    if (!agency) return <div>No tienes perfil de agencia activo.</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Mis Excursiones</h1>
                <Link href="/dashboard/agency/tours/new" className="bg-primary text-white px-4 py-2 rounded-lg font-bold hover:bg-primary-dark transition-colors">
                    + Nuevo Tour
                </Link>
            </div>

            <AgencyToursList tours={agency.tours} plans={plans} />
        </div>
    );
}
