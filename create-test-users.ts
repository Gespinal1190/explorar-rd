import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🔧 Creating test users in Neon database...\n');

    // Create agency test user
    const agencyEmail = 'agencia@test.com';
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        // Check if agency user already exists
        const existingAgency = await prisma.user.findUnique({
            where: { email: agencyEmail }
        });

        if (existingAgency) {
            console.log(`⚠️  User ${agencyEmail} already exists. Updating password...`);
            await prisma.user.update({
                where: { email: agencyEmail },
                data: { password: hashedPassword }
            });
            console.log(`✅ Password updated for ${agencyEmail}`);
        } else {
            // Create new agency user
            const agencyUser = await prisma.user.create({
                data: {
                    email: agencyEmail,
                    name: 'Agencia de Prueba',
                    password: hashedPassword,
                    role: 'AGENCY',
                }
            });

            // Create agency profile
            await prisma.agencyProfile.create({
                data: {
                    userId: agencyUser.id,
                    name: 'Agencia de Prueba',
                    isVerified: true,
                    phone: '+1-809-555-0100',
                    description: 'Agencia de turismo de prueba para desarrollo',
                }
            });

            console.log(`✅ Created agency user: ${agencyEmail}`);
            console.log(`   Password: ${password}`);
            console.log(`   Role: AGENCY`);
        }

        // Verify admin user exists
        const adminEmail = 'adalg.design@mail.com';
        const existingAdmin = await prisma.user.findUnique({
            where: { email: adminEmail }
        });

        if (existingAdmin) {
            console.log(`\n✅ Admin user exists: ${adminEmail}`);
        } else {
            console.log(`\n⚠️  Admin user not found. Creating...`);
            await prisma.user.create({
                data: {
                    email: adminEmail,
                    name: 'Admin',
                    password: hashedPassword,
                    role: 'ADMIN',
                }
            });
            console.log(`✅ Created admin user: ${adminEmail}`);
        }

        console.log('\n✅ All test users are ready!');
        console.log('\n📋 Test Credentials:');
        console.log('   Admin: adalg.design@mail.com / password123');
        console.log('   Agency: agencia@test.com / password123');

    } catch (error) {
        console.error('❌ Error creating users:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
