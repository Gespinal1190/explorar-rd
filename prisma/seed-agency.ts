import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const password = await hash('test1234', 12)

    // 1. Create User
    const user = await prisma.user.upsert({
        where: { email: 'agencia@test.com' },
        update: {},
        create: {
            email: 'agencia@test.com',
            name: 'Agencia Test Premium',
            password,
            role: 'AGENCY',
            phone: '809-555-9999'
        },
    })

    console.log('User created/found:', user.id)

    // 2. Create Agency Profile
    const agency = await prisma.agencyProfile.upsert({
        where: { userId: user.id },
        update: {},
        create: {
            userId: user.id,
            name: 'Agencia Test Premium',
            description: 'Somos una agencia demostrativa con las mejores experiencias de turismo interno en la República Dominicana. Especialistas en ecoturismo y aventuras extremas.',
            logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=400&h=400&fit=crop', // Logo placeholder
            phone: '809-555-9999',
            whatsapp: '809-555-9999',
            instagram: '@agenciatest',
            website: 'https://explorard.com',
            isVerified: true,
            rnc: '131-00000-1',
            licenseUrl: 'https://mitur.gob.do/licencia/fake-123',
            premisesUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80' // Office photo
        }
    })

    console.log('Agency Profile created:', agency.id)

    // 3. Create a Test Tour
    const tourTitle = 'Excursión VIP a Bahía de las Águilas'

    // Check if tour exists to avoid dupes on re-run
    const existingTour = await prisma.tour.findFirst({ where: { title: tourTitle, agencyId: agency.id } })

    if (!existingTour) {
        await prisma.tour.create({
            data: {
                agencyId: agency.id,
                title: tourTitle,
                description: 'Descubre el paraíso virgen de Bahía de las Águilas con nuestro servicio VIP. Incluye transporte en autobús de lujo, lancha privada, tiempo libre en la playa más cristalina del país y un almuerzo buffet de mariscos frescos en Cabo Rojo. Ideal para desconectar y conectar con la naturaleza.',
                location: 'Pedernales',
                latitude: 17.8667,
                longitude: -71.6333,
                price: 4500,
                duration: '1 Día (Salida 4:00 AM)',
                includes: JSON.stringify(['Transporte Confortable', 'Refrigerios', 'Almuerzo de Mariscos', 'Paseo en Lancha', 'Fotos Profesionales', 'Asistencia Médica']),
                instagramUrl: 'https://instagram.com/p/test-post',
                images: {
                    create: [
                        { url: 'https://images.unsplash.com/photo-1544473856-11f26e95ce36?auto=format&fit=crop&q=80' }, // Beach
                        { url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80' }, // Ocean
                        { url: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&q=80' }  // Resort/Relax
                    ]
                }
            }
        })
        console.log('Tour created: Bahía de las Águilas')
    } else {
        console.log('Tour already exists')
    }
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
