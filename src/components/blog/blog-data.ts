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
        title: "Los mejores tours y excursiones en República Dominicana (2026) | DescubreRD",
        excerpt: "Descubre los mejores tours y excursiones en República Dominicana 🇩🇴. Reserva experiencias auténticas en Punta Cana, Samaná y Santo Domingo con DescubreRD.",
        coverImage: "/images/blog/punta-cana.jpg",
        date: "2026-01-15",
        author: {
            name: "Equipo DescubreRD",
            role: "Especialistas Locales",
            avatar: "/logo.png"
        },
        category: "Guías Premium",
        readTime: "15 min",
        content: `
            <h1>Tours y excursiones en República Dominicana</h1>
            
            <p>Planificar un viaje al paraíso caribeño va mucho más allá de elegir un buen resort. Si realmente quieres vivir la esencia de la isla, necesitas explorar su oferta de <strong>tours y excursiones en República Dominicana</strong>. Desde las playas de arena blanca de Punta Cana hasta las montañas nubladas de Jarabacoa, nuestro país ofrece una diversidad que pocos destinos en el mundo pueden igualar.</p>
            
            <p>En esta guía definitiva para 2026, te llevamos de la mano por las experiencias más auténticas, seguras y emocionantes que puedes reservar hoy mismo a través de <a href="/es/tours" class="font-bold text-primary">DescubreRD</a>.</p>

            <h2>Tours en Punta Cana</h2>
            <p>Punta Cana no necesita presentación. Es el destino turístico más visitado del Caribe, pero su magia real ocurre cuando dejas el "All-Inclusive" atrás para descubrir sus tesoros naturales y culturales.</p>
            
            <h3>Isla Saona: El Paraíso en la Tierra</h3>
            <p>No existe búsqueda de <strong>excursiones en Dominicana</strong> que no mencione a Isla Saona. Ubicada dentro del Parque Nacional Cotubanamá, esta isla virgen es el epítome de la belleza tropical. Los tours suelen incluir navegación en catamarán, almuerzo buffet en la playa y una parada inolvidable en la "Piscina Natural", donde el agua te llega a la cintura a kilómetros de la costa. Es el lugar ideal para ver estrellas de mar (siempre respetando su entorno).</p>

            <h3>Buggy Macao: Adrenalina y Lodo</h3>
            <p>Para los que buscan acción, los buggies en Macao son obligatorios. Cruzarás caminos rurales, verás plantaciones de café y cacao, y terminarás bañándote en la cueva natural de "El Hoyo". Es, sin duda, una de las <strong>mejores actividades en Punta Cana</strong> para familias y grupos de amigos.</p>
            
            <p>Descubre todas nuestras opciones de <a href="/es/tours?search=Punta+Cana" class="font-bold text-primary italic underline">tours en Punta Cana aquí</a>.</p>

            <h2>Excursiones en Samaná</h2>
            <p>Samaná es la joya salvaje de la República Dominicana. Si buscas ecoturismo y paisajes que parecen sacados de una película, este es tu destino.</p>

            <h3>Observación de Ballenas Jorobadas</h3>
            <p>Cada año, entre enero y marzo, Samaná se convierte en el santuario de miles de ballenas jorobadas. Es una experiencia transformadora. Ver a estos majestuosos animales saltar y cortejar en su hábitat natural es algo que recordarás toda la vida. Es fundamental reservar con <strong>agencias verificadas por DescubreRD</strong> para asegurar un avistamiento ético y seguro.</p>

            <h3>Salto del Limón y Cayo Levantado</h3>
            <p>Imagina una caminata o cabalgata por la selva tropical que culmina en una imponente cascada de 50 metros. Ese es el Salto del Limón. Normalmente, este tour se combina con una tarde de relax en Cayo Levantado (también conocida como la isla Bacardí), brindándote lo mejor de la montaña y el mar en un solo día.</p>
            
            <p>Explora la magia de las <a href="/es/tours?search=Samana" class="font-bold text-primary italic underline">excursiones en Samaná aquí</a>.</p>

            <h2>Tours culturales en Santo Domingo</h2>
            <p>La capital de la República Dominicana es el corazón de la historia de América. Pasear por Santo Domingo es caminar por donde comenzó la civilización occidental en el Nuevo Mundo.</p>

            <h3>La Zona Colonial: Un Viaje en el Tiempo</h3>
            <p>Un tour cultural por la Zona Colonial te llevará a la Primera Catedral de América, el Alcázar de Colón y la Fortaleza Ozama. Pero no todo es piedras viejas; la zona está llena de cafés modernos, tiendas de artesanía de alta calidad y una vibrante vida nocturna. Es el lugar perfecto para entender la identidad dominicana.</p>

            <h3>Los Tres Ojos y el Faro a Colón</h3>
            <p>A pocos minutos del centro histórico, puedes visitar el Parque Nacional Los Tres Ojos, un sistema de cavernas con lagunas de agua dulce cristalina que te dejarán sin palabras. Es una parada técnica ideal si te interesa la geología y la naturaleza dentro de la ciudad.</p>
            
            <p>Consulta nuestra selección de <a href="/es/tours?search=Santo+Domingo" class="font-bold text-primary italic underline">tours en Santo Domingo</a>.</p>

            <h2>Aventura y naturaleza en República Dominicana</h2>
            <p>Si eres un "aventurero de corazón", te alegrará saber que RD es la capital de los deportes extremos en el Caribe.</p>
            
            <h3>27 Charcos de Damajagua</h3>
            <p>Ubicados en Puerto Plata, estos saltos de agua son un parque acuático natural. Prepárate para deslizarte por toboganes de piedra y saltar a pozas profundas bajo la supervisión de guías expertos. Es adrenalina pura en estado líquido.</p>

            <h3>Pico Duarte: El Techo del Caribe</h3>
            <p>Para los senderistas serios, el ascenso al Pico Duarte (3,087 metros) es el desafío definitivo. Una expedición de 2 a 3 días que te llevará por bosques de pinos y temperaturas que pueden bajar de los cero grados, algo impensable para muchos cuando piensan en el Caribe.</p>

            <h3>¿Por qué reservar con DescubreRD?</h3>
            <p>Sabemos que hay muchas opciones para reservar tus vacaciones, pero en DescubreRD nos diferenciamos por tres pilares fundamentales:</p>
            <ul>
                <li><strong>Agencias Verificadas:</strong> No cualquier operador puede estar en nuestra plataforma. Verificamos licencias, seguros y calidad del servicio para tu tranquilidad.</li>
                <li><strong>Precios Transparentes:</strong> Sin cargos ocultos. El precio que ves es el que pagas, apoyando directamente la economía local.</li>
                <li><strong>Soporte Especializado:</strong> Somos dominicanos y conocemos nuestro terreno. Si surge un cambio de clima o necesitas una recomendación personalizada, estamos a un mensaje de distancia.</li>
            </ul>

            <h3>Preguntas frecuentes sobre tours en República Dominicana</h3>
            
            <div class="space-y-6 my-8">
                <details class="group bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    <summary class="font-bold text-lg cursor-pointer list-none flex justify-between items-center text-gray-900">
                        ¿Cuál es la mejor época para hacer excursiones en RD?
                        <span class="transition-transform group-open:rotate-180">▼</span>
                    </summary>
                    <p class="mt-4 text-gray-600 leading-relaxed">
                        Aunque el clima es tropical todo el año, la época seca (de diciembre a abril) ofrece cielos despejados ideales para actividades al aire libre. Sin embargo, la temporada baja (mayo a noviembre) tiene mejores precios y menos multitudes.
                    </p>
                </details>

                <details class="group bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    <summary class="font-bold text-lg cursor-pointer list-none flex justify-between items-center text-gray-900">
                        ¿Es seguro reservar tours online en DescubreRD?
                        <span class="transition-transform group-open:rotate-180">▼</span>
                    </summary>
                    <p class="mt-4 text-gray-600 leading-relaxed">
                        Absolutamente. Utilizamos pasarelas de pago seguras (como PayPal) y trabajamos únicamente con operadores que cumplen con las normativas del Ministerio de Turismo de la República Dominicana.
                    </p>
                </details>

                <details class="group bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    <summary class="font-bold text-lg cursor-pointer list-none flex justify-between items-center text-gray-900">
                        ¿Debo dar propina en los tours?
                        <span class="transition-transform group-open:rotate-180">▼</span>
                    </summary>
                    <p class="mt-4 text-gray-600 leading-relaxed">
                        Las propinas no son obligatorias pero sí muy valoradas. Si el guía y el personal del barco o bus hicieron un trabajo excepcional, una propina del 10-15% es una forma estándar de mostrar agradecimiento.
                    </p>
                </details>
            </div>

            <h2>Conclusión</h2>
            <p>La República Dominicana tiene algo para cada tipo de viajero. Ya sea que busques la paz absoluta en una playa virgen, la historia profunda de una ciudad colonial o la adrenalina de una montaña desconocida, el país te espera con los brazos abiertos y una sonrisa contagiosa.</p>
            
            <p>No dejes que tu viaje se quede en el hotel. <strong>Haz que cuente.</strong> Reserva hoy mismo tus experiencias y deja que nosotros nos encarguemos de los detalles.</p>

            <div class="mt-12 text-center bg-primary p-10 rounded-[3rem] text-white shadow-2xl">
                <h3 class="text-3xl font-black mb-4">Empieza tu aventura ahora</h3>
                <p class="mb-8 font-medium">Explora cientos de opciones verificadas por todo el país.</p>
                <div class="flex flex-col sm:flex-row gap-4 justify-center">
                    <a href="/es/tours" class="px-8 py-4 bg-white text-primary font-black rounded-2xl hover:bg-gray-100 transition-colors shadow-lg">
                        Ver Todos los Tours
                    </a>
                    <a href="/es/agencies" class="px-8 py-4 bg-primary-700 text-white font-black rounded-2xl hover:bg-primary-800 transition-colors border border-white/20">
                        Ver Agencias Locales
                    </a>
                </div>
            </div>
            
            <p class="mt-20 text-gray-400 text-xs italic">
                *Nota: Este artículo es una guía informativa. Los precios y disponibilidad de los tours pueden variar según la temporada y la demanda.*
            </p>
        `
    }
];
