import { auth } from "@/lib/auth";
import { Link, redirect } from "@/navigation";
import prisma from "@/lib/prisma";
import Navbar from "@/components/ui/navbar";

export default async function CheckoutSuccessPage(props: {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ bookingId: string }>;
}) {
    const { locale } = await props.params;
    const session = await auth();
    if (!session) redirect({ href: "/login", locale });

    const { bookingId } = await props.searchParams;

    if (!bookingId) redirect({ href: "/dashboard/user/bookings", locale });

    const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
            tour: {
                include: { agency: true, images: true }
            }
        }
    });

    if (!booking) redirect({ href: "/dashboard/user/bookings", locale });

    const isTransfer = booking.paymentMethod === 'transfer';
    const isCash = booking.paymentMethod === 'cash';
    const isStripe = booking.paymentMethod === 'stripe';

    return (
        <div className="min-h-screen bg-[#FBFBF8]">
            <Navbar />
            <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center max-w-2xl">

                {/* Success Icon Animation */}
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-8 animate-in zoom-in duration-500">
                    <span className="text-5xl">✅</span>
                </div>

                <div className="space-y-4 mb-12">
                    <span className="px-4 py-1.5 bg-gray-900 text-white text-xs font-bold uppercase tracking-widest rounded-full">
                        Reserva #{booking.id.slice(-6).toUpperCase()}
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
                        ¡Reserva Recibida!
                    </h1>
                    <p className="text-xl text-gray-500 font-medium">
                        Ya diste el primer paso para tu próxima aventura en <span className="text-primary font-bold">{booking.tour.location}</span>.
                    </p>
                </div>

                {/* Next Steps Card */}
                <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100 w-full mb-8 text-left relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-primary to-teal-600"></div>

                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm">🚀</span>
                        Lo que sigue ahora:
                    </h3>

                    <div className="space-y-6">
                        {isTransfer && (
                            <>
                                <div className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold shrink-0">1</div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">Realiza el pago</h4>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Tienes 24 horas para transferir a las cuentas de <strong>{booking.tour.agency.name}</strong>.
                                            Verás los datos bancarios en el detalle de tu reserva.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0">2</div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">Sube el comprobante</h4>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Sube una foto de la transferencia en la sección "Mis Viajes" para confirmar tu cupo.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold shrink-0">3</div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">Confirmación</h4>
                                        <p className="text-sm text-gray-600 mt-1">
                                            La agencia validará tu pago y recibirás tu ticket final.
                                        </p>
                                    </div>
                                </div>
                            </>
                        )}

                        {isCash && (
                            <>
                                <div className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0">1</div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">Confirmación Pendiente</h4>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Has solicitado pagar en efectivo. La agencia <strong>{booking.tour.agency.name}</strong> revisará tu solicitud.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold shrink-0">2</div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">Contacto Directo</h4>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Es probable que la agencia te contacte por WhatsApp ({booking.tour.agency.whatsapp || 'el número registrado'}) para coordinar el encuentro.
                                        </p>
                                    </div>
                                </div>
                            </>
                        )}

                        {isStripe && (
                            <>
                                <div className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold shrink-0">1</div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">¡Todo listo!</h4>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Tu pago ha sido procesado y tu lugar está asegurado.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0">2</div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">Prepárate</h4>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Revisa tu correo para ver detalles de qué llevar y el punto exacto de encuentro.
                                        </p>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full">
                    <Link
                        href="/dashboard/user/bookings"
                        className="flex-1 bg-gray-900 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-black transition-all text-center"
                    >
                        Ir a Mis Viajes
                    </Link>
                    <Link
                        href="/tours"
                        className="flex-1 bg-white border border-gray-200 text-gray-700 font-bold py-4 rounded-xl hover:bg-gray-50 transition-all text-center"
                    >
                        Explorar más
                    </Link>
                </div>

            </div>
        </div>
    );
}
