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
    }
];
