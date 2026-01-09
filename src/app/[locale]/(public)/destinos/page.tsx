import Navbar from "@/components/ui/navbar";
import { InteractiveMap } from "@/components/destinations/interactive-map";
import { Link } from "@/navigation";
import { getTranslations } from "next-intl/server";
import { Footer } from "@/components/ui/footer";

export const metadata = {
    title: 'Explora República Dominicana | Destinos DescubreRD',
    description: 'Descubre los rincones más bellos de Quisqueya. Desde las playas de Punta Cana hasta las montañas de Jarabacoa.',
};

const destinationCards = [
    { name: 'Punta Cana', tours: 48, img: '/images/destinations/punta-cana.jpg', color: 'bg-blue-500' },
    { name: 'Samaná', tours: 32, img: '/images/destinations/samana.jpg', color: 'bg-green-500' },
    { name: 'Jarabacoa', tours: 24, img: '/images/destinations/jarabacoa.jpg', color: 'bg-emerald-600' },
    { name: 'Puerto Plata', tours: 29, img: '/images/destinations/puerto-plata.jpg', color: 'bg-teal-500' },
    { name: 'Santo Domingo', tours: 18, img: '/images/destinations/santo-domingo.jpg', color: 'bg-amber-600' },
    { name: 'Bayahíbe', tours: 35, img: '/images/destinations/bayahibe.jpg', color: 'bg-cyan-500' },
    { name: 'Barahona', tours: 12, img: '/images/destinations/bahia-aguilas.jpg', color: 'bg-indigo-500' },
    { name: 'Las Terrenas', tours: 21, img: '/images/destinations/samana.jpg', color: 'bg-sky-500' },
];

export default async function DestinosPage() {
    const t = await getTranslations("Destinations");

    return (
        <div className="min-h-screen bg-[#FBFBF8]">
            <Navbar />

            {/* Hero Header */}
            <header className="py-24 bg-white border-b border-gray-100 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none select-none overflow-hidden">
                    <span className="text-[20rem] font-black absolute -top-20 -left-20 rotate-12">DESCUBRE</span>
                </div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <span className="inline-block px-4 py-1.5 bg-primary/10 rounded-full text-primary text-xs font-black uppercase tracking-[0.2em] mb-6">
                        {t('guide')}
                    </span>
                    <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight mb-6">
                        {t('discoverTitle')} <span className="text-primary">{t('country')}</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-500 max-w-3xl mx-auto font-medium leading-relaxed">
                        {t('description')}
                    </p>
                </div>
            </header>

            {/* Interactive Map Section */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    <div className="mb-16 text-center lg:text-left">
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">{t('interactiveMap')}</h2>
                        <p className="text-gray-500 font-bold mt-2">{t('mapSubtitle')}</p>
                    </div>

                    <InteractiveMap />
                </div>
            </section>

            {/* Grid List Section */}
            <section className="py-24 bg-gray-900 text-white rounded-[4rem] mx-4 mb-12 overflow-hidden shadow-2xl relative">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full -mr-48 -mt-48 blur-[100px]"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                        <div>
                            <h2 className="text-4xl font-black tracking-tight mb-2">{t('allDestinations')}</h2>
                            <p className="text-gray-400 font-medium">{t('browseZones')}</p>
                        </div>
                        <div className="flex gap-4">
                            <button className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all">←</button>
                            <button className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all">→</button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {destinationCards.map((dest, i) => (
                            <Link
                                href={`/tours?search=${dest.name}`}
                                key={i}
                                className="group block relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-gray-800 border border-white/10 hover:border-primary/50 transition-all duration-500 hover:-translate-y-2"
                            >
                                <img
                                    src={dest.img}
                                    alt={dest.name}
                                    className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent p-8 flex flex-col justify-end">
                                    <p className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-2">{dest.tours} Tours</p>
                                    <h3 className="text-2xl font-black text-white group-hover:text-primary transition-colors">{dest.name}</h3>

                                    <div className="mt-6 flex items-center gap-2 text-sm font-bold text-gray-400 opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0">
                                        <span>{t('exploreZone')}</span>
                                        <span className="text-lg">→</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 text-center">
                <div className="container mx-auto px-4">
                    <div className="max-w-2xl mx-auto space-y-8">
                        <div className="w-20 h-20 bg-primary/10 text-primary flex items-center justify-center rounded-3xl mx-auto text-4xl shadow-inner border border-primary/20">
                            🇩🇴
                        </div>
                        <h2 className="text-4xl font-black text-gray-900 tracking-tight">{t('readyForAdventure')}</h2>
                        <p className="text-gray-500 text-lg font-medium leading-relaxed">
                            {t('adventureText')}
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link href="/tours" className="px-10 py-4 bg-primary text-white font-black rounded-full shadow-xl shadow-primary/20 hover:scale-105 transition-all text-lg">
                                {t('seeAllTours')}
                            </Link>
                            <Link href="/agencies/register" className="px-10 py-4 bg-white text-gray-900 border-2 border-gray-100 font-black rounded-full hover:bg-gray-50 transition-all text-lg">
                                {t('imAgency')}
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
}
