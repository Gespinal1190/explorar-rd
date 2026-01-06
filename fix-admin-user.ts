import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const adminEmail = 'adalg.design@gmail.com';
    const password = 'password123';

    console.log('Fixing admin user:', adminEmail);

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {
            password: hashedPassword,
            role: 'ADMIN'
        },
        create: {
            email: adminEmail,
            name: 'Admin',
            password: hashedPassword,
            role: 'ADMIN',
        }
    });

    console.log('SUCCESS - User ready:', user.email);
    console.log('Password:', password);

    const allUsers = await prisma.user.findMany({
        select: { email: true, role: true }
    });

    console.log('\nAll users:');
    allUsers.forEach(u => console.log('-', u.email, '(', u.role, ')'));

    await prisma.$disconnect();
}

main().catch(console.error);
