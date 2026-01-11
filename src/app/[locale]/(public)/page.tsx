import { Link } from "@/navigation";
import { TourCard } from "@/components/tours/tour-card";
import prisma from "@/lib/prisma";
import Navbar from "@/components/ui/navbar";
import { SearchOverlay } from "@/components/ui/search-overlay";
import { getTranslations } from "next-intl/server";
import { getSession } from "@/lib/session";
import { Footer } from "@/components/ui/footer";

export default async function Home() {
  const session = await getSession();
  const t = await getTranslations("Hero");
  const tHome = await getTranslations("Home");
  const tSearch = await getTranslations("Search");
  const userId = session?.userId ? String(session.userId) : null;

  let userFavorites: string[] = [];
  if (userId) {
    const favs = await prisma.favorite.findMany({
      where: { userId },
      select: { tourId: true }
    });
    userFavorites = favs.map(f => f.tourId);
  }

  const now = new Date();

  // Sort priority for plans
  const planPriority: Record<string, number> = {
    'ad_premium_1m': 3,
    'ad_medium_2w': 2,
    'ad_basic_1w': 1,
  };

  let allTours = [];
  try {
    allTours = (await prisma.tour.findMany({
      where: {
        status: 'PUBLISHED',
      },
      include: { agency: true, images: true },
      orderBy: [
        { createdAt: 'desc' }
      ] as any
    })) as any[];
  } catch (e) {
    console.error("Home query error:", e);
  }

  // Separate into featured and regular for manual sorting
  const featured = allTours.filter(t => t?.featuredExpiresAt && new Date(t.featuredExpiresAt) > now);
  const regular = allTours.filter(t => !t?.featuredExpiresAt || new Date(t.featuredExpiresAt) <= now);

  // Sort featured by plan priority
  featured.sort((a, b) => {
    const pA = planPriority[a?.featuredPlan || ''] || 0;
    const pB = planPriority[b?.featuredPlan || ''] || 0;
    return pB - pA;
  });

  const featuredTours = [...featured, ...regular].slice(0, 6);

  const categories = [
    { key: 'beaches', icon: '🏖️' },
    { key: 'mountains', icon: '⛰️' },
    { key: 'rivers', icon: '💧' },
    { key: 'buggies', icon: '🏎️' },
    { key: 'cultural', icon: '🎭' },
    { key: 'couples', icon: '💑' },
    { key: 'family', icon: '👨‍👩‍👧‍👦' }
  ];

  return (
    <main className="min-h-screen bg-[#FBFBF8]">
      <Navbar />

      {/* Hero Section - Product Focused */}
      <section className="relative min-h-[90svh] md:min-h-[85vh] flex flex-col items-center justify-center overflow-hidden gap-8 pt-24 pb-12">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90 z-10" />
          <img
            src="/images/hero-bg.jpg"
            alt="DescubreRD Hero"
            className="w-full h-full object-cover scale-105 animate-in fade-in duration-1000"
          />
        </div>

        <div className="relative z-20 w-full max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center justify-center">
          {/* Left Column: Traveller Focus (Primary) */}
          <div className="text-center lg:text-left space-y-8 animate-in slide-in-from-bottom-5 duration-700 delay-100">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-white/90 text-xs font-bold uppercase tracking-wider border border-white/20">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                {t('verifiedPlatform')}
              </span>
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-[0.95] drop-shadow-lg">
                {t('discoverTitle1')} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">{t('discoverTitle2')}</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-200 font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed whitespace-pre-line">
                {t('subtitle')}
              </p>
            </div>

            {/* Traveller CTA & Search */}
            <div className="space-y-6">
              <div className="bg-white/5 backdrop-blur-lg p-2 rounded-3xl border border-white/10 shadow-2xl max-w-lg mx-auto lg:mx-0">
                <SearchOverlay />
              </div>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm text-gray-300 font-medium">
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  {t('trustedBadges.payments')}
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  {t('trustedBadges.support')}
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  {t('trustedBadges.price')}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Agency CTA (Secondary Path) */}
          <div className="hidden lg:flex flex-col items-end justify-center animate-in fade-in slide-in-from-right-10 duration-1000 delay-300">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl max-w-sm hover:bg-white/10 transition-colors shadow-2xl group cursor-pointer">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-2xl">💼</span>
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">{t('agencyCta.areYouAgency')}</h3>
                  <p className="text-gray-400 text-xs">{t('agencyCta.manageBusiness')}</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                {t('agencyCta.description')}
              </p>
              <div className="space-y-3">
                <Link href="/agencies/register" className="flex items-center justify-between w-full px-5 py-3 bg-white text-gray-900 rounded-xl font-bold text-sm hover:scale-105 transition-transform">
                  {t('agencyCta.button')}
                  <span className="text-lg">→</span>
                </Link>
                <Link href="/login" className="block text-center text-xs text-white/50 hover:text-white transition-colors underline font-medium">
                  Ya tengo cuenta, iniciar sesión
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="relative w-full z-30">
          <div className="w-full max-w-7xl mx-auto px-4 overflow-x-auto scrollbar-hide">
            <div className="flex justify-center lg:justify-start gap-3 min-w-max pb-2">
              {categories.map((cat) => {
                const label = tSearch(`categories.${cat.key}` as any);
                return (
                  <Link href={`/tours?category=${label}`} key={cat.key} className="px-5 py-2.5 bg-black/40 backdrop-blur-md border border-white/10 text-white text-sm font-bold rounded-full hover:bg-primary hover:border-primary transition-all duration-300 whitespace-nowrap">
                    {cat.icon} {label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Destinos Populares Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-8 md:mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight leading-tight">{t('popularDestinationsTitle')}</h2>
              <p className="text-gray-500 font-medium mt-2 text-sm md:text-base">{t('popularDestinationsSubtitle')}</p>
            </div>
            <Link href="/destinos" className="text-primary font-black hover:underline hidden sm:block">
              {t('seeAll')} →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[
              {
                name: 'Punta Cana',
                image: '/images/destinations/punta-cana.jpg',
                count: 45
              },
              {
                name: 'Samaná',
                image: '/images/destinations/samana.jpg',
                count: 28
              },
              {
                name: 'Santo Domingo',
                image: '/images/destinations/santo-domingo.jpg',
                count: 15
              },
              {
                name: 'Puerto Plata',
                image: '/images/destinations/puerto-plata.jpg',
                count: 22
              }
            ].map((dest) => (
              <Link href={`/tours?search=${dest.name}`} key={dest.name} className="relative aspect-[4/5] sm:aspect-[3/4] rounded-2xl md:rounded-3xl overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500">
                <div className="absolute inset-0 bg-gray-900/20 group-hover:bg-gray-900/10 transition-colors z-10" />
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-5 md:p-6 z-20">
                  <h3 className="text-white font-bold text-xl md:text-2xl mb-1 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">{dest.name}</h3>
                  <div className="flex items-center gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-0 sm:translate-y-4 sm:group-hover:translate-y-0 text-white/90 text-xs md:text-sm font-medium">
                    <span>{tHome('exploreCount', { count: tHome('toursCount', { count: dest.count }) })}</span>
                    <span className="bg-white/20 p-1 rounded-full">➜</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link href="/destinos" className="text-primary font-black hover:underline">
              {t('seeAll')} →
            </Link>
          </div>
        </div>
      </section>

      {/* Los Más Buscados Section */}
      <section className="py-12 md:py-16 bg-gray-50 border-y border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-2xl">🔥</span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{t('mostWantedTitle')}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Reusing featured tours for demo but usually this would be a filtered subset */}
            {featuredTours.slice(0, 3).map((tour: any) => (
              <Link href={`/tours/${tour?.slug || tour?.id}`} key={tour?.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex gap-4 hover:shadow-md transition-shadow cursor-pointer group">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl bg-gray-200 overflow-hidden shrink-0">
                  <img src={tour?.images?.[0]?.url || '/placeholder.jpg'} alt={tour?.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="flex flex-col justify-center">
                  <h4 className="font-bold text-gray-900 line-clamp-2 group-hover:text-primary transition-colors text-sm md:text-base leading-snug">{tour?.title}</h4>
                  <p className="text-[10px] md:text-xs text-gray-500 mt-1 uppercase font-bold tracking-wider">{tour?.location}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-primary font-black text-sm md:text-base">
                      {tour?.currency === 'USD' ? 'USD$' : tour?.currency === 'EUR' ? '€' : 'RD$'}
                      {tour?.price?.toLocaleString() || '0'}
                    </span>
                    <span className="text-[9px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-black uppercase tracking-tighter italic">{tHome('topChoice')}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tours */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-10 md:mb-12">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">{t('featuredToursTitle')}</h2>
              <p className="text-gray-500 mt-2 text-sm md:text-base font-medium">{t('featuredToursSubtitle')}</p>
            </div>
            <Link href="/tours" className="text-primary font-bold hover:underline hidden sm:block">
              {t('seeAll')} →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {featuredTours.map((tour: any) => {
              const isFeatured = tour?.featuredExpiresAt && new Date(tour.featuredExpiresAt) > new Date();
              const isFavorite = userFavorites.includes(tour.id);

              return (
                <TourCard
                  key={tour?.id}
                  id={tour?.id}
                  slug={tour?.slug}
                  title={tour?.title}
                  price={tour?.price || 0}
                  currency={tour?.currency || 'DOP'}
                  location={tour?.location || 'RD'}
                  image={tour?.images?.[0]?.url}
                  agencyName={tour?.agency?.name || 'Agencia Local'}
                  isFeatured={isFeatured}
                  featuredPlan={tour?.featuredPlan}
                  isAgencyPro={tour?.agency?.tier === 'PRO'}
                  isFavorite={isFavorite}
                />
              );

            })}
          </div>

          <div className="mt-10 text-center sm:hidden">
            <Link href="/tours" className="inline-block px-8 py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20">
              {t('seeAll')}
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us - Enhanced */}
      <section className="py-20 md:py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12 md:mb-16 space-y-4 px-4">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
              {t('whyChooseUsTitle')}
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-base md:text-lg leading-relaxed font-medium">
              {t('whyChooseUsSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="p-8 bg-gray-50 rounded-[2rem] md:rounded-[2.5rem] hover:bg-white hover:shadow-xl transition-all duration-500 group border border-transparent hover:border-gray-100">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7 md:w-8 md:h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t('why1Title')}</h3>
              <p className="text-gray-500 leading-relaxed font-medium text-sm md:text-base">
                {t('why1Text')}
              </p>
            </div>

            <div className="p-8 bg-gray-50 rounded-[2rem] md:rounded-[2.5rem] hover:bg-white hover:shadow-xl transition-all duration-500 group border border-transparent hover:border-gray-100">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7 md:w-8 md:h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t('why2Title')}</h3>
              <p className="text-gray-500 leading-relaxed font-medium text-sm md:text-base">
                {t('why2Text')}
              </p>
            </div>

            <div className="p-8 bg-gray-50 rounded-[2rem] md:rounded-[2.5rem] hover:bg-white hover:shadow-xl transition-all duration-500 group border border-transparent hover:border-gray-100">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7 md:w-8 md:h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t('why3Title')}</h3>
              <p className="text-gray-500 leading-relaxed font-medium text-sm md:text-base">
                {t('why3Text')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Agency CTA Section */}
      <section className="py-16 md:py-24 bg-primary border-t border-white/10 relative overflow-hidden">
        {/* Background Pattern (Optional subtle flag element or gradient) */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="max-w-3xl mx-auto space-y-6 md:space-y-8">
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight drop-shadow-sm">
              {t('joinAgencyTitle')}
            </h2>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed font-medium drop-shadow-sm px-4">
              {t('joinAgencySubtitle')}
            </p>
            <div className="pt-4 flex justify-center">
              <Link
                href="/agencies/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-white text-primary px-10 py-4 rounded-2xl font-black text-lg hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-xl"
              >
                {t('registerAgencyBtn')}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
