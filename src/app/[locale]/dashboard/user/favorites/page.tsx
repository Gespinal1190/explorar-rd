import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { TourCard } from "@/components/tours/tour-card";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

export default async function UserFavoritesPage() {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
        redirect("/login");
        return null;
    }

    const t = await getTranslations("Favorites");

    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            favorites: {
                include: {
                    tour: {
                        include: { agency: true, images: true }
                    }
                }
            }
        }
    });

    if (!user) return <div>{t('userNotFound')}</div>;
    const favorites = user.favorites.map((f: any) => f.tour);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
            {favorites.length === 0 ? (
                <div className="bg-white p-12 rounded-3xl text-center border border-gray-100">
                    <p className="text-gray-500">{t('emptyMessage')}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {favorites.map((tour: any) => (
                        <TourCard
                            key={tour.id}
                            id={tour.id}
                            slug={tour.slug}
                            title={tour.title}
                            price={tour.price}
                            location={tour.location}
                            image={tour.images[0]?.url}
                            agencyName={tour.agency.name}
                            isAgencyPro={tour.agency?.tier === 'PRO'}
                            currency={tour.currency || 'DOP'}
                            isFavorite={true}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
