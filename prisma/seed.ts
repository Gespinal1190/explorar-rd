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
                        ]
                    }
                },
            },
        },
        include: { agencyProfile: true },
    })

    const agencyUser = agencyUserRequest as any;

    if (agencyUser.agencyProfile) {
        const agencyId = agencyUser.agencyProfile.id

        const tours = [
            {
                title: 'Isla Saona VIP - Catamarán y Lanchas',
                slug: 'isla-saona-vip-catamaran-y-lanchas',
                description: 'La excursión más popular de RD. Navega en catamarán con fiesta, visita la piscina natural con estrellas de mar y almuerza en la isla Saona.',
                location: 'Punta Cana',
                price: 4500,
                duration: '10 horas',
                includes: JSON.stringify(['Transporte Ida/Vuelta', 'Almuerzo Buffet', 'Barra Libre Nacional', 'Guía']),
                images: ['/images/tours/saona.png'],
                dates: ['2026-02-14', '2026-02-18', '2026-02-25', '2026-03-01']
            },
            {
                title: 'Salto del Limón a Caballo',
                slug: 'salto-del-limon-a-caballo',
                description: 'Adéntrate en la selva de Samaná a caballo hasta llegar a la impresionante cascada del Limón. Un baño refrescante te espera.',
                location: 'Samaná',
                price: 3200,
                duration: '6 horas',
                includes: JSON.stringify(['Caballos', 'Guía Local', 'Almuerzo Típico', 'Entrada al Parque']),
                images: ['/images/tours/limon.png'],
                dates: ['2026-02-15', '2026-02-20', '2026-03-05']
            },
            {
                title: 'Buggy Macao Extreme',
                slug: 'buggy-macao-extreme',
                description: 'Conduce tu propio buggy por caminos de tierra, visita una casa típica, prueba café y cacao, y termina en la playa Macao.',
                location: 'Punta Cana',
                price: 2800,
                duration: '4 horas',
                includes: JSON.stringify(['Buggy Polaris', 'Casco', 'Degustación', 'Agua']),
                images: ['/images/tours/buggy.png'],
                dates: ['2026-01-20', '2026-01-25', '2026-01-28']
            },
            {
                title: 'Zona Colonial Histórica',
                slug: 'zona-colonial-historica',
                description: 'Recorrido a pie por la primada de América. Visita el Alcázar de Colón, la Catedral y las calles empedradas llenas de historia.',
                location: 'Santo Domingo',
                price: 1500,
                duration: '3 horas',
                includes: JSON.stringify(['Guía Certificado', 'Entradas a Museos', 'Agua']),
                images: ['/images/tours/zona.png'],
                dates: ['2026-01-15', '2026-01-22', '2026-01-29']
            },
            {
                title: '27 Charcos de Damajagua',
                slug: '27-charcos-de-damajagua',
                description: 'Aventura pura saltando y deslizándote por los charcos naturales de Damajagua. Adrenalina y naturaleza.',
                location: 'Puerto Plata',
                price: 3800,
                duration: '7 horas',
                includes: JSON.stringify(['Equipo de Seguridad', 'Guías', 'Almuerzo', 'Transporte']),
                images: ['/images/tours/limon.png'], // Reusing waterfall image for Damajagua as it is similar
                dates: ['2026-03-10', '2026-03-15']
            }
        ]

        for (const tour of tours) {
            // Upsert based on slug
            const exists = await prisma.tour.findUnique({ where: { slug: tour.slug } })
            if (!exists) {
                await prisma.tour.create({
                    data: {
                        agencyId,
                        title: tour.title,
                        slug: tour.slug,
                        description: tour.description,
                        location: tour.location,
                        price: tour.price,
                        duration: tour.duration,
                        includes: tour.includes,
                        images: {
                            create: tour.images.map(url => ({ url }))
                        },
                        // @ts-ignore
                        dates: tour.dates ? {
                            create: tour.dates.map(d => ({ date: new Date(d) }))
                        } : undefined
                    }
                })
            } else {
                // Update images if verifying fix
                await prisma.tourImage.deleteMany({ where: { tourId: exists.id } });
                await prisma.tour.update({
                    where: { id: exists.id },
                    data: {
                        images: {
                            create: tour.images.map(url => ({ url }))
                        }
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

    // 5. RESTORED: Create Flota La Extra User & Agency
    // 5. RESTORED: Create Flota La Extra User & Agency (with original ID)
    const flotaUserRequest = await prisma.user.upsert({
        where: { email: 'flotalaex@gmail.com' },
        update: {
            agencyProfile: {
                update: {
                    phone: '(829) 555-0999',
                    whatsapp: '18295550999',
                    // Setting these to null as confirmed by user ("N/A")
                    instagram: null,
                    website: null,
                    rnc: 'gs://explorard-19b5b.firebasestorage.app/docs/rnc.jpg', // Placeholder
                    licenseUrl: 'gs://explorard-19b5b.firebasestorage.app/docs/registro.jpg' // Placeholder
                }
            }
        },
        create: {
            // Using the ID provided by the user from Firebase
            id: 'RAMulXwAvqMOGJPpnrSWCw3PeyZ2',
            email: 'flotalaex@gmail.com',
            name: 'Flota La Extra',
            password: hashedPassword,
            role: 'AGENCY',
            agencyProfile: {
                create: {
                    name: 'Flota La Extra',
                    description: 'Agencia de tours especializados en Monte Cristi y Cayo Arena.',
                    phone: '(829) 555-0999',
                    whatsapp: '18295550999',
                    instagram: null,
                    website: null,
                    rnc: 'gs://explorard-19b5b.firebasestorage.app/docs/rnc.jpg', // Placeholder
                    licenseUrl: 'gs://explorard-19b5b.firebasestorage.app/docs/registro.jpg', // Placeholder
                    isVerified: true,
                    tier: 'PRO'
                }
            }
        },
        include: { agencyProfile: true }
    })

    const flotaUser = flotaUserRequest as any;
    if (flotaUser.agencyProfile) {
        const agencyId = flotaUser.agencyProfile.id

        // Restore "Los 3 Ojos" Tour (Placeholder based on user recollection)
        // User mentioned "Tour 3 Ojos" existed before SEO work.
        const tourData = {
            title: 'Excursión Los Tres Ojos',
            slug: 'excursion-los-tres-ojos',
            description: 'Descubre las maravillas naturales del Parque Nacional Los Tres Ojos. Un recorrido por lagunas subterráneas y cuevas impresionantes en el corazón de Santo Domingo.',
            location: 'Santo Domingo',
            price: 2500, // Estimated placeholder
            duration: '4 horas',
            includes: JSON.stringify(['Transporte', 'Entrada al Parque', 'Guía']),
            images: ['/images/destinations/santo-domingo.jpg'], // Placeholder image
            dates: ['2026-03-15', '2026-03-20']
        }

        const exists = await prisma.tour.findUnique({ where: { slug: tourData.slug } })
        if (!exists) {
            await prisma.tour.create({
                data: {
                    agencyId,
                    title: tourData.title,
                    slug: tourData.slug,
                    description: tourData.description,
                    location: tourData.location,
                    price: tourData.price,
                    duration: tourData.duration,
                    includes: tourData.includes,
                    images: { create: tourData.images.map(url => ({ url })) },
                    // @ts-ignore
                    dates: { create: tourData.dates.map(d => ({ date: new Date(d) })) }
                }
            })
        }
    }

    console.log('Seeding finished. Accounts: admin, agencia, usuario, flotalaex.')
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
