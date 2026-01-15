export interface BlogPost {
    slug: string;
    title: string;
    excerpt: string;
    content: string; // HTML content
    coverImage: string;
    date: string;
    author: {
        name: string;
        role: string;
        avatar: string;
    };
    category: string;
    readTime: string;
    structuredData?: object; // JSON-LD Schema
}

export const blogPosts: BlogPost[] = [
    {
        slug: "que-hacer-en-punta-cana-en-3-dias",
        title: "Qué hacer en Punta Cana en 3 días: Itinerario Perfecto",
        excerpt: "No te quedes solo en el hotel. Te organizamos la agenda para que vivas aventura, playa y cultura en 72 horas inolvidables.",
        coverImage: "/images/blog/punta-cana.jpg", // Punta Cana Resort/Reach
        date: "2026-01-09",
        author: {
            name: "Laura Jiménez",
            role: "Coordinadora de Experiencias",
            avatar: "https://randomuser.me/api/portraits/women/65.jpg"
        },
        category: "Itinerarios",
        readTime: "6 min",
        content: `
            <h2>Día 1: Aventura y Adrenalina</h2>
            <p>Empieza tu viaje con energía. <a href="/destinos/punta-cana" class="text-primary font-bold hover:underline">Punta Cana</a> no es solo playa tranquila; su terreno selvático es perfecto para la acción.</p>
            <p>Por la mañana, te recomendamos salir del resort y llenarte de lodo.</p>
            
            <div class="my-8 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <h3 class="mt-0 text-xl font-bold text-gray-900">Recomendación del Día 1:</h3>
                <p class="text-gray-600 mb-4">Conduce tu propio buggy por caminos rurales hasta la playa Macao.</p>
                <a href="/tours/buggy-macao-extreme" class="inline-flex items-center text-primary font-bold hover:underline">
                    Ver Tour: Buggy Macao Extreme →
                </a>
            </div>

            <h2>Día 2: La Joya del Caribe</h2>
            <p>No puedes venir a Punta Cana y no visitar <strong>Isla Saona</strong>. Es el escenario de la película "Laguna Azul" y un parque nacional protegido.</p>
            <p>Dedica el día completo a esto. Navegarás en catamarán con barra libre y regresarás en lancha rápida. Es la excursión #1 del país.</p>
             <div class="my-8 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <h3 class="mt-0 text-xl font-bold text-gray-900">Imperdible del Día 2:</h3>
                <a href="/tours/isla-saona-vip-catamaran-y-lanchas" class="inline-flex items-center text-primary font-bold hover:underline">
                    Reservar Isla Saona VIP →
                </a>
            </div>

            <h2>Día 3: Relax y Cultura Local</h2>
            <p>Para tu último día, baja las revoluciones. Visita Punta Cana centro o relájate en Playa Blanca. Si te quedas con ganas de más, las agencias locales ofrecen cenas show increíbles.</p>

            <p>Este itinerario es traído a ustedes por <a href="/agencies" class="font-bold text-primary">Explora Vida Tours</a>, verificada por DescubreRD.</p>
        `
    },
    {
        slug: "mejor-epoca-ver-ballenas-samana",
        title: "Mejor época para ver ballenas en Samaná: Guía 2026",
        excerpt: "Miles de ballenas jorobadas visitan nuestras costas cada año. Descubre cuándo y cómo ver este espectáculo natural único.",
        coverImage: "/images/blog/whale.png", // Breaching Whale
        date: "2026-01-05",
        author: {
            name: "Carlos Matos",
            role: "Fotógrafo de Naturaleza",
            avatar: "https://randomuser.me/api/portraits/men/32.jpg"
        },
        category: "Naturaleza",
        readTime: "5 min",
        content: `
            <h2>El Santuario de Mamíferos Marinos</h2>
            <p>Cada año, entre <strong>enero y marzo</strong>, la Bahía de <a href="/destinos/samana" class="text-primary font-bold hover:underline">Samaná</a> se convierte en el escenario de uno de los espectáculos más impresionantes de la naturaleza.</p>

            <h3>Calendario de Avistamiento</h3>
            <ul>
                <li><strong>Enero:</strong> Comienzan a llegar los primeros machos exploradores.</li>
                <li><strong>Febrero (Pico):</strong> El mejor mes. Madres con sus ballenatos y machos saltando para cortejar.</li>
                <li><strong>Marzo:</strong> Comienzan a retirarse hacia el norte, pero aún son muy visibles.</li>
            </ul>

            <h3>Combina tu viaje</h3>
            <p>Samaná es selva y agua. Si vas a ver las ballenas, aprovecha que ya estás ahí para adentrarte en la selva.</p>

            <div class="my-8 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <h3 class="mt-0 text-xl font-bold text-gray-900">Completa tu aventura:</h3>
                <p>Después del mar, refréscate en la cascada más famosa de la región.</p>
                <div class="flex flex-col gap-2">
                     <a href="/tours/salto-del-limon-a-caballo" class="inline-flex items-center text-primary font-bold hover:underline">
                        Ver Tour: Salto del Limón a Caballo →
                    </a>
                    <a href="/tours?location=Samana" class="inline-flex items-center text-gray-600 hover:text-primary text-sm font-medium">
                        Ver todos los tours en Samaná →
                    </a>
                </div>
            </div>
             <p>Organizado con guías locales certificados por el Ministerio de Turismo.</p>
        `
    },
    {
        slug: "isla-saona-guia-precios-consejos",
        title: "Isla Saona: qué incluye un tour, precios y consejos",
        excerpt: "Todo lo que necesitas saber antes de ir a Saona: precios justos, qué llevar y cómo evitar las trampas para turistas.",
        coverImage: "/images/blog/saona.png", // Tropical Beach Boat
        date: "2026-01-03",
        author: {
            name: "María Rodríguez",
            role: "Experta en Turismo",
            avatar: "https://randomuser.me/api/portraits/women/44.jpg"
        },
        category: "Guías Completas",
        readTime: "8 min",
        content: `
            <h2>La Excursión #1 de República Dominicana</h2>
            <p>Si vienes a RD y no vas a Saona, ¿realmente viniste? Esta isla virgen al sureste es el paraíso caribeño por excelencia. Accesible desde <a href="/destinos/punta-cana" class="text-primary font-bold hover:underline">Punta Cana</a> y Bayahibe.</p>

            <h3>¿Qué incluye normalmente un tour?</h3>
            <ul>
                <li><strong>Transporte:</strong> Recogida en tu hotel.</li>
                <li><strong>Navegación:</strong> Catamarán y Lancha rápida.</li>
                <li><strong>Piscina Natural:</strong> Parada para ver estrellas de mar.</li>
                <li><strong>Comida:</strong> Almuerzo buffet dominicano en la playa.</li>
            </ul>

            <div class="my-8 p-6 bg-blue-50 rounded-2xl border border-blue-100">
                <h3 class="mt-0 text-xl font-bold text-blue-900">Precio Recomendado</h3>
                <p class="text-blue-800">Un buen tour todo incluido ronda los <strong>US$70 - $90</strong>. Desconfía de precios muy bajos.</p>
            </div>

            <div class="my-8 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <h3 class="mt-0 text-xl font-bold text-gray-900">Nuestra Recomendación:</h3>
                <div class="flex flex-col gap-2">
                    <a href="/tours/isla-saona-vip-catamaran-y-lanchas" class="inline-flex items-center text-primary font-bold hover:underline">
                        👉 Ver disponibilidad para Isla Saona VIP
                    </a>
                     <a href="/tours/buggy-macao-extreme" class="inline-flex items-center text-gray-600 hover:text-primary text-sm font-medium">
                        Combínalo con: Buggies en Macao →
                    </a>
                </div>
            </div>
             <p>Recomendamos agencias como <a href="/agencies" class="font-bold">Explora Vida Tours</a> por sus estándares de seguridad.</p>
        `
    },
    {
        slug: "gastronomia-dominicana-platos-imprescindibles",
        title: "Gastronomía Dominicana: 10 Platos que debes probar",
        excerpt: "Desde el Mofongo hasta el Sancocho. Una ruta culinaria por los sabores que definen nuestra identidad caribeña.",
        coverImage: "/images/blog/mofongo.png", // Food generic high quality
        date: "2025-12-20",
        author: {
            name: "Chef Sosa",
            role: "Crítico Gastronómico",
            avatar: "https://randomuser.me/api/portraits/men/85.jpg"
        },
        category: "Cultura y Comida",
        readTime: "6 min",
        content: `
            <h2>Sabor con Historia</h2>
            <p>Nuestra comida es una mezcla de influencias taínas, españolas y africanas.</p>

            <h3>1. La Bandera Dominicana</h3>
            <p>El almuerzo de cada día: Arroz blanco, habichuelas rojas guisadas y carne, acompañado de fritos maduros. Simple y delicioso.</p>

            <h3>2. Mofongo</h3>
            <p>Plátano verde frito majado con ajo y chicharrón. Disfrútalo en tu visita a <a href="/destinos/santo-domingo" class="text-primary font-bold hover:underline">Santo Domingo</a>.</p>

            <h3>3. Pescado Frito estilo 'Boca Chica'</h3>
            <p>Pescado fresco frito entero. Perfecto para comer después de un día de playa.</p>

            <div class="my-8 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <h3 class="mt-0 text-xl font-bold text-gray-900">Tour Cultural</h3>
                <p>La mejor forma de probarlo todo es caminando por la ciudad más antigua de América.</p>
                <a href="/tours/zona-colonial-historica" class="inline-flex items-center text-primary font-bold hover:underline">
                    Ver Tour Gastronómico y Cultural →
                </a>
            </div>
        `
    },
    {
        slug: "los-mejores-tours-y-excursiones-dominicana-2026",
        title: "Excursiones y tours en República Dominicana - DescubreRD",
        excerpt: "Guía definitiva 2026: Descubre las mejores excursiones en Punta Cana, Samaná y Santo Domingo. Aventuras verificadas, precios reales y consejos locales.",
        coverImage: "/images/blog/punta-cana.jpg",
        date: "2026-01-15",
        author: {
            name: "Equipo DescubreRD",
            role: "Especialistas en Turismo Local",
            avatar: "/logo.png"
        },
        category: "Guías Premium",
        readTime: "18 min",
        structuredData: {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "TouristTrip",
                    "name": "Mejores Excursiones en República Dominicana",
                    "description": "Itinerario completo de las experiencias turísticas más destacadas en RD: Isla Saona, Buggies, Ballenas en Samaná y Zona Colonial.",
                    "touristType": ["AdventureTourism", "CulturalTourism"],
                    "itinerary": [
                        { "@type": "City", "name": "Punta Cana" },
                        { "@type": "City", "name": "Samaná" },
                        { "@type": "City", "name": "Santo Domingo" }
                    ],
                    "offers": {
                        "@type": "Offer",
                        "url": "https://descubrerd.app/es/tours",
                        "priceCurrency": "USD",
                        "availability": "https://schema.org/InStock"
                    },
                    "provider": {
                        "@type": "Organization",
                        "name": "DescubreRD",
                        "url": "https://descubrerd.app"
                    }
                },
                {
                    "@type": "FAQPage",
                    "mainEntity": [
                        {
                            "@type": "Question",
                            "name": "¿Cuál es la mejor excursión en República Dominicana?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Sin duda, la visita a Isla Saona es la excursión número 1, combinando catamarán, playas vírgenes y piscinas naturales."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "¿Es seguro reservar tours online?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Sí, plataformas como DescubreRD verifican a cada agencia local y ofrecen garantías de pago seguro vía PayPal."
                            }
                        }
                    ]
                }
            ]
        },
        content: `
            <h1>Excursiones y tours en República Dominicana</h1>
            
            <p><strong>República Dominicana lo tiene todo.</strong> Esa famosa frase publicitaria no es una exageración, es una promesa. Desde las costas de arena blanca infinita en el este hasta las cimas montañosas más altas del Caribe en el centro, este país es un continente en miniatura esperando ser explorado.</p>
            
            <p>Pero seamos honestos: venir a RD y quedarse encerrado en el buffet del hotel es perderse el 90% de la magia. La verdadera República Dominicana vibra en sus selvas, canta en sus saltos de agua y cuenta historias en sus calles coloniales. Si estás buscando <strong>tours y excursiones en República Dominicana</strong> que te cambien la vida (o al menos tus fotos de perfil), has llegado a la guía definitiva.</p>
            
            <p>En este artículo, desglosamos las experiencias imperdibles divididas por las zonas más icónicas: <a href="https://descubrerd.app/es/tours/punta-cana" class="text-primary font-bold hover:underline">Punta Cana</a>, <a href="https://descubrerd.app/es/tours/samana" class="text-primary font-bold hover:underline">Samaná</a> y <a href="https://descubrerd.app/es/tours/santo-domingo" class="text-primary font-bold hover:underline">Santo Domingo</a>. Prepárate para tomar apuntes.</p>

            <h2>H2: Tours en Punta Cana</h2>
            <p>Punta Cana es la joya de la corona del turismo caribeño. Con sus 32 kilómetros de playas ininterrumpidas, es el punto de partida perfecto para la aventura.</p>

            <h3>Isla Saona: La Postal Perfecta</h3>
            <p>No se puede hablar de excursiones en República Dominicana sin mencionar a la reina indiscutible: <strong>Isla Saona</strong>. Situada en el extremo sureste, dentro del Parque Nacional Cotubanamá, esta isla es un santuario protegido donde no existen los hoteles, solo palmeras, arena y un mar tan azul que parece editado.</p>
            
            <p>La experiencia típica comienza en Bayahibe (a una hora de Punta Cana). Subes a un catamarán gigante con música y barra libre, navegas suavemente hacia la isla, y regresas en lancha rápida para sentir la adrenalina. Lo mejor es la parada en la <strong>Piscina Natural</strong>: un banco de arena en medio del mar donde el agua te llega a la cintura y puedes ver estrellas de mar gigantes.</p>
            
            <blockquote>
                <p><strong>Tip Pro:</strong> Reserva el tour VIP que incluye almuerzo con langosta parrilla en un área privada de la playa. Vale cada centavo extra para evitar las multitudes.</p>
            </blockquote>

            <h3>Buggies en Macao y Cenotes</h3>
            <p>Si prefieres el lodo al agua salada, la excursión de Buggies (Terracross) es obligatoria. Conducirás tu propio vehículo todo terreno a través de caminos rurales, pasando por plantaciones de café y cacao, hasta llegar a la impresionante Playa Macao, una de las pocas playas públicas vírgenes que quedan en la zona.</p>
            <p>El recorrido suele terminar en un cenote indígena (cueva con agua dulce), donde podrás lavarte el polvo con un chapuzón refrescante en aguas subterráneas.</p>
            
            <p>👉 <a href="https://descubrerd.app/es/tours/punta-cana" class="font-bold text-primary">Ver todos los tours disponibles en Punta Cana</a></p>

            <h2>H2: Excursiones en Samaná</h2>
            <p>Si Punta Cana es la fiesta, Samaná es el alma salvaje. Esta península al noreste del país es famosa por ser uno de los lugares más verdes y biodiversos del Caribe.</p>

            <h3>El Santuario de las Ballenas Jorobadas</h3>
            <p>Es un fenómeno natural de clase mundial. Cada año, entre <strong>enero y marzo</strong>, miles de ballenas jorobadas migran desde el Atlántico Norte hasta las cálidas aguas de la Bahía de Samaná para reproducirse y dar a luz.</p>
            <p>Ver a una criatura de 40 toneladas saltar fuera del agua a pocos metros de tu barco es una experiencia que te hace sentir pequeño y maravillado. Las regulaciones son estrictas para proteger a los animales, por lo que es vital reservar solo con operadores certificados.</p>

            <h3>Salto del Limón</h3>
            <p>Imagina una caminata (o un paseo a caballo) a través de un bosque tropical denso, cruzando ríos y subiendo colinas, hasta que de repente se abre el paisaje y ves caer una cortina de agua de 50 metros de altura.</p>
            <p>El Salto del Limón no es solo una cascada; es un ícono. Bañarse en sus aguas frescas después de la caminata es el premio perfecto. Al regreso, te espera un almuerzo típico dominicano en una casa rural local.</p>

            <h3>Cayo Levantado (Isla Bacardí)</h3>
            <p>Un pequeño islote en medio de la bahía con una playa de ensueño. Es el lugar ideal para relajarse después de ver las ballenas. Sus aguas son tranquilas y cristalinas, perfectas para el snorkeling.</p>
            
            <p>👉 <a href="https://descubrerd.app/es/tours/samana" class="font-bold text-primary">Explorar aventuras en Samaná</a></p>

            <h2>H2: Tours culturales en Santo Domingo</h2>
            <p>La República Dominicana es también historia. Santo Domingo no es solo la capital del país; es la <strong>Ciudad Primada de América</strong>, el lugar donde comenzó la historia europea en el Nuevo Mundo.</p>

            <h3>La Zona Colonial</h3>
            <p>Caminar por las calles empedradas de la Zona Colonial es viajar al siglo XVI. Aquí encontrarás:</p>
            <ul>
                <li><strong>Catedral Primada de América:</strong> La primera catedral construida en el continente.</li>
                <li><strong>Alcázar de Colón:</strong> La residencia de Diego Colón, hijo del almirante.</li>
                <li><strong>Calle Las Damas:</strong> La calle más antigua del hemisferio.</li>
            </ul>
            <p>Pero la Zona no es un museo aburrido. Está llena de vida, con cafés de especialidad, galerías de arte, bares de puros y restaurantes de alta cocina escondidos en patios coloniales españoles.</p>

            <h3>Los Tres Ojos</h3>
            <p>A solo 10 minutos del centro, el Parque Nacional Los Tres Ojos te ofrece un descanso de la ciudad. Es una cueva abierta con tres lagunas (ojos) de agua dulce de un azul intenso. Un cuarto lago, accesible solo por barcaza, parece sacado de la película Jurassic Park (y de hecho, algunas escenas se filmaron allí).</p>

            <p>👉 <a href="https://descubrerd.app/es/tours/santo-domingo" class="font-bold text-primary">Descubre la historia en Santo Domingo</a></p>

            <h2>H2: Aventura y naturaleza en República Dominicana (Otras Joyas)</h2>
            <p>Más allá de los "3 Grandes" (Punta Cana, Samaná, Santo Domingo), el país está lleno de rincones secretos para los más aventureros.</p>
            
            <h3>27 Charcos de Damajagua (Puerto Plata)</h3>
            <p>Este es el parque acuático de la Madre Naturaleza. Ubicado en la cordillera septentrional, es un complejo de 27 cascadas y piscinas naturales talladas en piedra caliza. El tour consiste en subir la montaña y luego bajar saltando, deslizándose por toboganes de piedra y nadando a través de cañones estrechos.</p>
            
            <h3>Bahía de las Águilas (Pedernales)</h3>
            <p>En el profundo sur, cerca de la frontera, se encuentra la que muchos consideran la playa más hermosa del mundo. Bahía de las Águilas es virgen, remota y deslumbrante. No hay hoteles ni restaurantes en la playa misma; solo kilómetros de arena blanca y un mar tan claro que marea. Es el destino final para los que buscan desconexión total.</p>

            <h2>H3: Consejos para reservar tus excursiones</h2>
            <p>Para asegurar que tus <strong>tours y excursiones en República Dominicana</strong> sean un éxito, sigue estos consejos prácticos:</p>
            <ol>
                <li><strong>Verifica la Agencia:</strong> Asegúrate de que el operador tenga licencia del Ministerio de Turismo (MITUR) y seguros de responsabilidad civil. En <a href="https://descubrerd.app/es/tours" class="text-primary font-bold">DescubreRD</a>, hacemos esa verificación por ti.</li>
                <li><strong>Reserva con Antelación:</strong> Los tours populares como Saona VIP o Ballenas tienen cupos limitados y se llenan semanas antes, especialmente en temporada alta.</li>
                <li><strong>Lleva Efectivo:</strong> Aunque pagues el tour online, necesitarás efectivo (pesos o dólares) para propinas y souvenirs locales.</li>
                <li><strong>Protégete del Sol:</strong> El sol caribeño es fuerte. Usa protector solar biodegradable, gorra y lentes de sol siempre.</li>
            </ol>

            <h2>Conclusión</h2>
            <p>La República Dominicana es un destino de mil caras. Puedes venir diez veces y vivir diez viajes completamente diferentes. La clave está en salir del hotel y atreverse a explorar.</p>
            <p>Ya sea que busques la historia colonial, la adrenalina de los buggies o la paz absoluta de una isla desierta, este país te espera con los brazos abiertos y una sonrisa.</p>
            <p>¿Listo para crear recuerdos que duren para siempre? No esperes a que te lo cuenten.</p>

            <div class="mt-12 mb-12 p-8 bg-gray-50 rounded-2xl border border-gray-200">
                <h3 class="text-2xl font-bold mb-6 text-center">Preguntas Frecuentes</h3>
                <div class="space-y-4">
                    <details class="group bg-white p-4 rounded-xl shadow-sm">
                        <summary class="font-bold cursor-pointer list-none flex justify-between items-center text-gray-800">
                            ¿Cuál es la mejor zona para excursiones?
                            <span class="transition-transform group-open:rotate-180 text-primary">▼</span>
                        </summary>
                        <p class="mt-2 text-gray-600">Punta Cana ofrece la mayor variedad y facilidad de acceso. Samaná es mejor para naturaleza pura y ecoturismo. Santo Domingo es ideal para cultura e historia.</p>
                    </details>
                    <details class="group bg-white p-4 rounded-xl shadow-sm">
                        <summary class="font-bold cursor-pointer list-none flex justify-between items-center text-gray-800">
                            ¿Qué moneda debo llevar a las excursiones?
                            <span class="transition-transform group-open:rotate-180 text-primary">▼</span>
                        </summary>
                        <p class="mt-2 text-gray-600">El Dólar Americano (USD) y el Peso Dominicano (DOP) son aceptados en casi todas partes. Lleva billetes pequeños para propinas.</p>
                    </details>
                     <details class="group bg-white p-4 rounded-xl shadow-sm">
                        <summary class="font-bold cursor-pointer list-none flex justify-between items-center text-gray-800">
                            ¿Son seguros los tours de aventura?
                            <span class="transition-transform group-open:rotate-180 text-primary">▼</span>
                        </summary>
                        <p class="mt-2 text-gray-600">Sí, siempre y cuando reserves con operadores certificados que utilicen equipos de seguridad adecuados (cascos, arneses, chalecos salvavidas). Evita tours informales en la calle.</p>
                    </details>
                </div>
            </div>

            <div class="text-center">
                <a href="https://descubrerd.app/es/tours" class="inline-block px-8 py-4 bg-primary text-white font-bold text-lg rounded-full shadow-xl hover:bg-primary-dark transition-transform hover:-translate-y-1">
                    Ver Catálogo Completo de Tours
                </a>
            </div>
        `
    }
];
