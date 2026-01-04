import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    // 1. Create Admin User
    await prisma.user.upsert({
        where: { email: 'admin@explorard.com' },
        update: {},
        create: {
            email: 'admin@explorard.com',
            name: 'Admin User',
            password: 'password123', // In real app, hash this
            role: 'ADMIN',
        },
    })

    // 2. Create Agency User & Profile
    const agencyUser = await prisma.user.upsert({
        where: { email: 'agencia@tours.com' },
        update: {},
        create: {
            email: 'agencia@tours.com',
            name: 'Manuel Tours Manager',
            password: 'password123',
            role: 'AGENCY',
            agencyProfile: {
                create: {
                    name: 'Manuel Tours RD',
                    description: 'Expertos en excursiones a Samaná y Los Haitises. Más de 10 años de experiencia.',
                    phone: '(809) 555-0101',
                    whatsapp: '18095550101',
                    instagram: 'manueltoursrd',
                    isVerified: true,
                },
            },
        },
        include: { agencyProfile: true },
    })

    // 3. Create Tours for Agency
    if (agencyUser.agencyProfile) {
        const tourTitle = 'Salto del Limón & Cayo Levantado';
        const existingTour = await prisma.tour.findFirst({ where: { title: tourTitle } })

        if (!existingTour) {
            await prisma.tour.create({
                data: {
                    agencyId: agencyUser.agencyProfile.id,
                    title: tourTitle,
                    description: 'Excursión completa visitando la cascada del Limón a caballo y almuerzo en Cayo Levantado.',
                    location: 'Samaná',
                    price: 3500,
                    duration: '8 horas',
                    includes: JSON.stringify(['Transporte', 'Almuerzo', 'Bebidas', 'Caballo']),
                    images: {
                        create: [
                            { url: 'https://placehold.co/600x400' }
                        ]
                    }
                }
            })
        }

        const tourTitle2 = 'Buggy Adventure Macao';
        const existingTour2 = await prisma.tour.findFirst({ where: { title: tourTitle2 } })

        if (!existingTour2) {
            await prisma.tour.create({
                data: {
                    agencyId: agencyUser.agencyProfile.id,
                    title: tourTitle2,
                    description: 'Aventura llena de adrenalina en buggies por la playa de Macao y cueva indígena.',
                    location: 'Punta Cana',
                    price: 2500,
                    duration: '4 horas',
                    includes: JSON.stringify(['Casco', 'Agua', 'Degustación']),
                    images: {
                        create: [
                            { url: 'https://placehold.co/600x400' }
                        ]
                    }
                }
            })
        }
    }

    // 4. Create Normal User
    await prisma.user.upsert({
        where: { email: 'usuario@test.com' },
        update: {},
        create: {
            email: 'usuario@test.com',
            name: 'Juan Pérez',
            password: 'password123',
            role: 'USER',
        },
    })

    console.log('Seeding finished.')
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
