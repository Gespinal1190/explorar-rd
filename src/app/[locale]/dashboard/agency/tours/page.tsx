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
                <Link href="/dashboard/agency/tours/new" className="bg-primary text-white px-4 py-2 rounded-lg font-bold hover:bg-primary-dark transition-colors">
                    {t('newTour')}
                </Link>
            </div>

            <AgencyToursList tours={agency.tours} plans={plans} />
        </div>
    );
}

