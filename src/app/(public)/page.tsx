import Link from "next/link";
import { TourCard } from "@/components/tours/tour-card";
import prisma from "@/lib/prisma";
import Navbar from "@/components/ui/navbar";
import { SearchOverlay } from "@/components/ui/search-overlay";

export default async function Home() {
  const now = new Date();

  // Sort priority for plans
  const planPriority: Record<string, number> = {
    'ad_premium_1m': 3,
    'ad_standard_2w': 2,
    'ad_basic_1w': 1,
  };

  const allTours = (await prisma.tour.findMany({
    include: { agency: true, images: true },
    orderBy: [
      { agency: { tier: 'desc' } },
      { createdAt: 'desc' }
    ] as any
  })) as any[];

  // Separate into featured and regular for manual sorting
  const featured = allTours.filter(t => t.featuredExpiresAt && new Date(t.featuredExpiresAt) > now);
  const regular = allTours.filter(t => !t.featuredExpiresAt || new Date(t.featuredExpiresAt) <= now);

  // Sort featured by plan priority
  featured.sort((a, b) => {
    const pA = planPriority[a.featuredPlan || ''] || 0;
    const pB = planPriority[b.featuredPlan || ''] || 0;
    return pB - pA;
  });

  const featuredTours = [...featured, ...regular].slice(0, 6);

  return (
    <main className="min-h-screen bg-[#FBFBF8]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[90svh] md:h-screen flex items-center justify-center text-center px-4 overflow-hidden">
        {/* Background Overlay */}
        <div className="absolute inset-0 z-0 select-none">
          <div className="absolute inset-0 bg-black/40 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 z-10" />
          <img
            src="/images/hero-bg.jpg"
            alt="Explorar RD Hero"
            className="w-full h-full object-cover animate-in fade-in duration-1000 scale-105"
          />
        </div>

        <div className="relative z-20 w-full max-w-5xl mx-auto space-y-6 md:space-y-10 flex flex-col items-center">
          <div className="space-y-4 md:space-y-6 animate-in slide-in-from-bottom-5 duration-700 delay-100">
            <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-white/90 text-xs md:text-sm font-bold uppercase tracking-[0.2em] border border-white/20">
              República Dominicana
            </span>
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-white tracking-tight drop-shadow-sm leading-tight text-center">
              Descubre el <br />
              <span className="text-primary drop-shadow-lg">Paraíso</span> Dominicano
            </h1>
            <p className="text-lg md:text-2xl text-white/90 font-medium max-w-2xl mx-auto drop-shadow-md leading-relaxed px-4">
              La plataforma más completa de turismo interno. Conecta con agencias locales y vive experiencias únicas.
            </p>
          </div>

          {/* Search Component container */}
          <div className="w-full max-w-2xl px-2 animate-in slide-in-from-bottom-5 duration-700 delay-300">
            <SearchOverlay />
          </div>

          {/* Quick Categories */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 animate-in slide-in-from-bottom-5 duration-700 delay-400">
            {['Playas 🏖️', 'Montaña ⛰️', 'Ríos 💧', 'Buggy 🏎️', 'Cultural 🎭'].map((cat) => (
              <a href={`/tours?category=${cat}`} key={cat} className="px-4 py-2 md:px-6 md:py-2.5 bg-white/5 backdrop-blur-md border border-white/10 text-white text-xs md:text-sm font-bold rounded-full hover:bg-white hover:text-black hover:border-white transition-all duration-300 hover:-translate-y-1 transform cursor-pointer shadow-lg shadow-black/5">
                {cat}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Destinos Populares Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-8 md:mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight leading-tight">Destinos <span className="text-primary">Populares</span></h2>
              <p className="text-gray-500 font-medium mt-2 text-sm md:text-base">Los rincones más buscados de nuestra isla.</p>
            </div>
            <Link href="/destinos" className="text-primary font-black hover:underline hidden sm:block">
              Ver todos →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[
              {
                name: 'Punta Cana',
                image: '/images/destinations/punta-cana.jpg',
                count: '45+ Tours'
              },
              {
                name: 'Samaná',
                image: '/images/destinations/samana.jpg',
                count: '28+ Tours'
              },
              {
                name: 'Santo Domingo',
                image: '/images/destinations/santo-domingo.jpg',
                count: '15+ Tours'
              },
              {
                name: 'Puerto Plata',
                image: '/images/destinations/puerto-plata.jpg',
                count: '22+ Tours'
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
                    <span>Explore {dest.count}</span>
                    <span className="bg-white/20 p-1 rounded-full">➜</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link href="/destinos" className="text-primary font-black hover:underline">
              Ver todos los destinos →
            </Link>
          </div>
        </div>
      </section>

      {/* Los Más Buscados Section */}
      <section className="py-12 md:py-16 bg-gray-50 border-y border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-2xl">🔥</span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Los Más Buscados</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Reusing featured tours for demo but usually this would be a filtered subset */}
            {featuredTours.slice(0, 3).map((tour: any) => (
              <Link href={`/tours/${tour.id}`} key={tour.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex gap-4 hover:shadow-md transition-shadow cursor-pointer group">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl bg-gray-200 overflow-hidden shrink-0">
                  <img src={tour.images[0]?.url || '/placeholder.jpg'} alt={tour.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="flex flex-col justify-center">
                  <h4 className="font-bold text-gray-900 line-clamp-2 group-hover:text-primary transition-colors text-sm md:text-base leading-snug">{tour.title}</h4>
                  <p className="text-[10px] md:text-xs text-gray-500 mt-1 uppercase font-bold tracking-wider">{tour.location}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-primary font-black text-sm md:text-base">
                      {tour.currency === 'USD' ? 'USD$' : tour.currency === 'EUR' ? '€' : 'RD$'}
                      {tour.price.toLocaleString()}
                    </span>
                    <span className="text-[9px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-black uppercase tracking-tighter italic">Top Choice</span>
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
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Tours <span className="text-primary">Destacados</span></h2>
              <p className="text-gray-500 mt-2 text-sm md:text-base font-medium">Descubre lo que otros viajeros están amando.</p>
            </div>
            <Link href="/tours" className="text-primary font-bold hover:underline hidden sm:block">
              Ver todos →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {featuredTours.map((tour: any) => {
              const isFeatured = tour.featuredExpiresAt && new Date(tour.featuredExpiresAt) > new Date();
              return (
                <TourCard
                  key={tour.id}
                  id={tour.id}
                  title={tour.title}
                  price={tour.price}
                  currency={tour.currency}
                  location={tour.location}
                  image={tour.images[0]?.url}
                  agencyName={tour.agency.name}
                  isFeatured={isFeatured}
                  featuredPlan={tour.featuredPlan}
                  isAgencyPro={tour.agency.tier === 'PRO'}
                />
              );
            })}
          </div>

          <div className="mt-10 text-center sm:hidden">
            <Link href="/tours" className="inline-block px-8 py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20">
              Ver todas las excursiones
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us - Enhanced */}
      <section className="py-20 md:py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12 md:mb-16 space-y-4 px-4">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
              ¿Por qué elegir <span className="text-primary md:inline-block">Explorar RD</span>?
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-base md:text-lg leading-relaxed font-medium">
              Simplificamos el turismo conectándote con los mejores operadores del país de forma segura y directa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="p-8 bg-gray-50 rounded-[2rem] md:rounded-[2.5rem] hover:bg-white hover:shadow-xl transition-all duration-500 group border border-transparent hover:border-gray-100">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7 md:w-8 md:h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Agencias Verificadas</h3>
              <p className="text-gray-500 leading-relaxed font-medium text-sm md:text-base">
                Cada operador pasa por un riguroso proceso de validación legal y de calidad. Tu seguridad es nuestra prioridad.
              </p>
            </div>

            <div className="p-8 bg-gray-50 rounded-[2rem] md:rounded-[2.5rem] hover:bg-white hover:shadow-xl transition-all duration-500 group border border-transparent hover:border-gray-100">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7 md:w-8 md:h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Mejores Precios</h3>
              <p className="text-gray-500 leading-relaxed font-medium text-sm md:text-base">
                Reserva directamente con el proveedor. Sin intermediarios costosos ni comisiones ocultas al final del proceso.
              </p>
            </div>

            <div className="p-8 bg-gray-50 rounded-[2rem] md:rounded-[2.5rem] hover:bg-white hover:shadow-xl transition-all duration-500 group border border-transparent hover:border-gray-100">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7 md:w-8 md:h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Soporte Local</h3>
              <p className="text-gray-500 leading-relaxed font-medium text-sm md:text-base">
                Estamos en República Dominicana. Entendemos tus necesidades y te brindamos soporte real en tu propio idioma.
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
              ¿Eres una Agencia de Viajes?
            </h2>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed font-medium drop-shadow-sm px-4">
              Únete a la plataforma líder en RD. Publica tus tours, conecta con miles de viajeros y haz crecer tu negocio.
            </p>
            <div className="pt-4 flex justify-center">
              <Link
                href="/agencies/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-white text-primary px-10 py-4 rounded-2xl font-black text-lg hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-xl"
              >
                Registrar mi Agencia
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Placeholder (since we'll likely implement a Footer component separately or in layout) */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-6">Descubre<span className="text-primary">RD</span></h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                La plataforma líder en turismo interno de República Dominicana. Conectando viajeros con experiencias inolvidables.
              </p>

              <div className="flex gap-4">
                <a href="/" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all duration-300" aria-label="Instagram">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                </a>
                <a href="/" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all duration-300" aria-label="Facebook">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                </a>
                <a href="/" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all duration-300" aria-label="YouTube">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" /><path d="m10 15 5-3-5-3z" /></svg>
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-6">Explora</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Inicio</a></li>
                <li><a href="#" className="hover:text-white">Destinos</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6">Legal</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Términos y Condiciones</a></li>
                <li><a href="#" className="hover:text-white">Privacidad</a></li>
                <li><a href="#" className="hover:text-white">Cookies</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6">Contacto</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li>info@explorard.com</li>
                <li>Santo Domingo, RD</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} Explorar RD. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </main>
  );
}
