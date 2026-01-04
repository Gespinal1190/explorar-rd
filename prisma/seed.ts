import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const hashedPassword = await bcrypt.hash('password123', 10)

    // 1. Create Admin User
    await prisma.user.upsert({
        where: { email: 'admin@test.com' },
        update: {},
        create: {
            email: 'admin@test.com',
            name: 'Super Admin',
            password: hashedPassword,
            role: 'ADMIN',
        },
    })

    // 2. Create Agency User & Profile (agencia@test.com)
    const agencyUser = await prisma.user.upsert({
        where: { email: 'agencia@test.com' },
        update: {},
        create: {
            email: 'agencia@test.com',
            name: 'Explora Vida Tours',
            password: hashedPassword,
            role: 'AGENCY',
            agencyProfile: {
                create: {
                    name: 'Explora Vida RD',
                    description: 'Somos expertos en turismo ecológico y de aventura en toda la República Dominicana. Garantizamos seguridad y diversión.',
                    phone: '(809) 555-0101',
                    whatsapp: '18095550101',
                    instagram: 'exploravidard',
                    isVerified: true,
                    tier: 'PRO'
                },
            },
        },
        include: { agencyProfile: true },
    })

    // 3. Create Tours for Agency
    if (agencyUser.agencyProfile) {
        const agencyId = agencyUser.agencyProfile.id

        const tours = [
            {
                title: 'Isla Saona VIP - Catamarán y Lanchas',
                description: 'La excursión más popular de RD. Navega en catamarán con fiesta, visita la piscina natural con estrellas de mar y almuerza en la isla Saona.',
                location: 'Punta Cana', // mapped to Bayahibe usually but sticking to popular zones
                price: 4500,
                duration: '10 horas',
                includes: JSON.stringify(['Transporte Ida/Vuelta', 'Almuerzo Buffet', 'Barra Libre Nacional', 'Guía']),
                images: ['https://images.unsplash.com/photo-1590523741831-ab7f291db9f7?q=80&w=800'],
                dates: ['2024-02-14', '2024-02-18', '2024-02-25']
            },
            {
                title: 'Salto del Limón a Caballo',
                description: 'Adéntrate en la selva de Samaná a caballo hasta llegar a la impresionante cascada del Limón. Un baño refrescante te espera.',
                location: 'Samaná',
                price: 3200,
                duration: '6 horas',
                includes: JSON.stringify(['Caballos', 'Guía Local', 'Almuerzo Típico', 'Entrada al Parque']),
                images: ['https://images.unsplash.com/photo-1623164348562-q3245235235?q=80&w=800'],
                dates: ['2024-02-15', '2024-02-20']
            },
            {
                title: 'Buggy Macao Extreme',
                description: 'Conduce tu propio buggy por caminos de tierra, visita una casa típica, prueba café y cacao, y termina en la playa Macao.',
                location: 'Punta Cana',
                price: 2800,
                duration: '4 horas',
                includes: JSON.stringify(['Buggy Polaris', 'Casco', 'Degustación', 'Agua']),
                images: ['https://images.unsplash.com/photo-1534954471963-3d4432174c0c?q=80&w=800']
                // No specific dates (daily)
            },
            {
                title: 'Zona Colonial Histórica',
                description: 'Recorrido a pie por la primada de América. Visita el Alcázar de Colón, la Catedral y las calles empedradas llenas de historia.',
                location: 'Santo Domingo',
                price: 1500,
                duration: '3 horas',
                includes: JSON.stringify(['Guía Certificado', 'Entradas a Museos', 'Agua']),
                images: ['https://images.unsplash.com/photo-1548690321-fb8bcc61b99c?q=80&w=800']
            },
            {
                title: '27 Charcos de Damajagua',
                description: 'Aventura pura saltando y deslizándote por los charcos naturales de Damajagua. Adrenalina y naturaleza.',
                location: 'Puerto Plata',
                price: 3800,
                duration: '7 horas',
                includes: JSON.stringify(['Equipo de Seguridad', 'Guías', 'Almuerzo', 'Transporte']),
                images: ['https://images.unsplash.com/photo-1589802829985-817e51171b92?q=80&w=800']
            }
        ]

        for (const tour of tours) {
            // Check if exists to avoid dupes on multiple runs
            const exists = await prisma.tour.findFirst({ where: { title: tour.title, agencyId } })
            if (!exists) {
                await prisma.tour.create({
                    data: {
                        agencyId,
                        title: tour.title,
                        description: tour.description,
                        location: tour.location,
                        price: tour.price,
                        duration: tour.duration,
                        includes: tour.includes,
                        images: {
                            create: tour.images.map(url => ({ url }))
                        },
                        dates: tour.dates ? {
                            create: tour.dates.map(d => ({ date: new Date(d) }))
                        } : undefined
                    }
                })
            }
        }
    }

    // 4. Create Normal User
    await prisma.user.upsert({
        where: { email: 'usuario@test.com' },
        update: {},
        create: {
            email: 'usuario@test.com',
            name: 'Juan Pérez Viajero',
            password: hashedPassword,
            role: 'USER',
        },
    })

    console.log('Seeding finished. Accounts: admin@test.com, agencia@test.com, usuario@test.com (pass: password123)')
}

main()

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
