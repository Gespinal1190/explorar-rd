import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getPlans } from "@/lib/plans";
import MembershipClient from "@/components/dashboard/membership-client";

export default async function AgencyMembershipPage() {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId || session.user.role !== 'AGENCY') return null;

    const [agency, plans] = await Promise.all([
        prisma.agencyProfile.findUnique({
            where: { userId: userId }
        }),
        getPlans('MEMBERSHIP')
    ]);

    if (!agency) return <div>No se encontró perfil de agencia.</div>;

    return (
        <div className="max-w-4xl mx-auto py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Membresía del Socio</h1>
                <p className="text-gray-500">Gestiona tu nivel de suscripción y beneficios.</p>
            </div>

            <MembershipClient agency={agency} plans={plans} />
        </div>
    );
}
