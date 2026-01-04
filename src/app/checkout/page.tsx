import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { CheckoutClient } from "@/components/checkout/checkout-client";
import Navbar from "@/components/ui/navbar";

export default async function CheckoutPage({
    searchParams,
}: {
    searchParams: Promise<{ tourId: string; date: string; guests: string }>;
}) {
    const session = await auth();
    if (!session) {
        redirect("/login?callbackUrl=/checkout");
    }

    const { tourId, date, guests } = await searchParams;

    if (!tourId || !date || !guests) {
        redirect("/tours");
    }

    const tour = await prisma.tour.findUnique({
        where: { id: tourId },
        include: { agency: true, images: true }
    });

    if (!tour) {
        return <div>Tour no encontrado</div>;
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id }
    });

    if (!user) {
        redirect("/login");
    }

    return (
        <div className="min-h-screen bg-[#FBFBF8]">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-black text-gray-900 mb-8">Confirmar Reserva</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Summary Card */}
                    <div className="order-2 md:order-1">
                        <CheckoutClient
                            tour={tour}
                            date={date}
                            guests={parseInt(guests)}
                            user={user}
                        />
                    </div>

                    {/* Order Summary (Static for context) */}
                    <div className="order-1 md:order-2">
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 sticky top-24">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Resumen del Viaje</h3>
                            <div className="flex gap-4 mb-4">
                                <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                                    <img src={tour.images[0]?.url} className="w-full h-full object-cover" alt="" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 leading-tight">{tour.title}</h4>
                                    <p className="text-sm text-gray-500 mt-1">{tour.location}</p>
                                </div>
                            </div>

                            <hr className="border-gray-50 my-4" />

                            <div className="space-y-3 text-sm text-gray-600">
                                <div className="flex justify-between">
                                    <span>Fecha</span>
                                    <span className="font-bold text-gray-900">{date}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Viajeros</span>
                                    <span className="font-bold text-gray-900">{guests} Adultos</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Precio por persona</span>
                                    <span className="font-bold text-gray-900">RD${tour.price.toLocaleString()}</span>
                                </div>
                            </div>

                            <hr className="border-gray-100 my-4" />

                            <div className="flex justify-between items-end">
                                <span className="font-bold text-gray-900">Total a Pagar</span>
                                <span className="text-2xl font-black text-gray-900">RD${(tour.price * parseInt(guests)).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
