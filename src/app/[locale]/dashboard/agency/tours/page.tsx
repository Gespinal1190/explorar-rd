import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Link } from "@/navigation";
import AgencyToursList from "@/components/dashboard/agency-tours-list";
import { getPlans } from "@/lib/plans";
import { getTranslations } from "next-intl/server";

export default async function AgencyToursPage() {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) return null;
    const t = await getTranslations("AgencyTours");

    const [agency, plans] = await Promise.all([
        prisma.agencyProfile.findUnique({
            where: { userId: userId },
            include: { tours: true }
        }),
        getPlans('AD')
    ]);

    if (!agency) return <div>{t('noProfile')}</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">{t('pageTitle')}</h1>
                {agency.status === 'ACTIVE' ? (
                    <Link href="/dashboard/agency/tours/new" className="bg-primary text-white px-4 py-2 rounded-lg font-bold hover:bg-primary-dark transition-colors">
                        {t('newTour')}
                    </Link>
                ) : (
                    <div className="hidden"></div>
                )}
            </div>

            {/* Status Alerts */}
            {agency.status === 'PENDING' && (
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6" role="alert">
                    <p className="font-bold">Cuenta Pendiente</p>
                    <p>Tu agencia está en proceso de revisión. Una vez aprobada por el administrador, podrás publicar tus anuncios aquí.</p>
                </div>
            )}

            {(agency.status === 'PAUSED' || agency.status === 'SUSPENDED') && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
                    <p className="font-bold">Cuenta Pausada</p>
                    <p>Tu agencia ha sido pausada o suspendida. No puedes crear nuevos anuncios en este momento. Por favor contacta al administrador.</p>
                </div>
            )}

            <AgencyToursList tours={agency.tours} plans={plans} agencyId={agency.id} />
        </div>
    );
}

