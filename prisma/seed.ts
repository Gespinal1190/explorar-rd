import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const hashedPassword = await bcrypt.hash('password123', 10)

    // 1. Create Admin User
    await prisma.user.upsert({
        where: { email: 'adalg.design@gmail.com' },
        update: {},
        create: {
            email: 'adalg.design@gmail.com',
            name: 'Super Admin',
            password: hashedPassword,
            role: 'ADMIN',
        },
    })

    // 2. Create Agency User & Profile (agencia@test.com)
    const agencyUserRequest = await prisma.user.upsert({
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
                    // @ts-ignore - tier is valid in schema
                    tier: 'PRO',
                    bankAccounts: {
                        create: [
                            {
                                bankName: 'Banco Popular',
                                accountNumber: '7894561230',
                                accountType: 'CORRIENTE',
                                beneficiaryName: 'Explora Vida SRL'
                            },
                            {
                                bankName: 'Banreservas',
                                accountNumber: '1112223334',
                                accountType: 'AHORROS',
                                beneficiaryName: 'Juan Pérez'
                            }
                        ]
                    }
                },
            },
        },
        include: { agencyProfile: true },
    })

    const agencyUser = agencyUserRequest as any;

    // 3. Create Tours for Agency
    if (agencyUser.agencyProfile) {
        const agencyId = agencyUser.agencyProfile.id

        const tours = [
            {
                title: 'Isla Saona VIP - Catamarán y Lanchas',
                description: 'La excursión más popular de RD. Navega en catamarán con fiesta, visita la piscina natural con estrellas de mar y almuerza en la isla Saona.',
                location: 'Punta Cana',
                price: 4500,
                duration: '10 horas',
                includes: JSON.stringify(['Transporte Ida/Vuelta', 'Almuerzo Buffet', 'Barra Libre Nacional', 'Guía']),
                images: ['https://images.unsplash.com/photo-1590523741831-ab7f291db9f7?q=80&w=800'],
                dates: ['2026-02-14', '2026-02-18', '2026-02-25', '2026-03-01']
            },
            {
                title: 'Salto del Limón a Caballo',
                description: 'Adéntrate en la selva de Samaná a caballo hasta llegar a la impresionante cascada del Limón. Un baño refrescante te espera.',
                location: 'Samaná',
                price: 3200,
                duration: '6 horas',
                includes: JSON.stringify(['Caballos', 'Guía Local', 'Almuerzo Típico', 'Entrada al Parque']),
                images: ['https://images.unsplash.com/photo-1623164348562-q3245235235?q=80&w=800'],
                dates: ['2026-02-15', '2026-02-20', '2026-03-05']
            },
            {
                title: 'Buggy Macao Extreme',
                description: 'Conduce tu propio buggy por caminos de tierra, visita una casa típica, prueba café y cacao, y termina en la playa Macao.',
                location: 'Punta Cana',
                price: 2800,
                duration: '4 horas',
                includes: JSON.stringify(['Buggy Polaris', 'Casco', 'Degustación', 'Agua']),
                images: ['https://images.unsplash.com/photo-1534954471963-3d4432174c0c?q=80&w=800'],
                dates: ['2026-01-20', '2026-01-25', '2026-01-28']
            },
            {
                title: 'Zona Colonial Histórica',
                description: 'Recorrido a pie por la primada de América. Visita el Alcázar de Colón, la Catedral y las calles empedradas llenas de historia.',
                location: 'Santo Domingo',
                price: 1500,
                duration: '3 horas',
                includes: JSON.stringify(['Guía Certificado', 'Entradas a Museos', 'Agua']),
                images: ['https://images.unsplash.com/photo-1548690321-fb8bcc61b99c?q=80&w=800'],
                dates: ['2026-01-15', '2026-01-22', '2026-01-29']
            },
            {
                title: '27 Charcos de Damajagua',
                description: 'Aventura pura saltando y deslizándote por los charcos naturales de Damajagua. Adrenalina y naturaleza.',
                location: 'Puerto Plata',
                price: 3800,
                duration: '7 horas',
                includes: JSON.stringify(['Equipo de Seguridad', 'Guías', 'Almuerzo', 'Transporte']),
                images: ['https://images.unsplash.com/photo-1589802829985-817e51171b92?q=80&w=800'],
                dates: ['2026-03-10', '2026-03-15']
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
                        // @ts-ignore - dates relation is valid
                        dates: tour.dates ? {
                            create: tour.dates.map(d => ({ date: new Date(d) }))
                        } : undefined
                    }
                })
            } else {
                // Optimization: Update dates if tour exists to ensure we have future dates
                if (tour.dates) {
                    // Clean up old dates and re-add new ones to ensure freshness
                    // @ts-ignore - tourDate model exists
                    await prisma.tourDate.deleteMany({ where: { tourId: exists.id } })
                    await prisma.tour.update({
                        where: { id: exists.id },
                        data: {
                            // @ts-ignore - dates relation update is valid
                            dates: {
                                create: tour.dates.map(d => ({ date: new Date(d) }))
                            }
                        }
                    })
                }
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
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
