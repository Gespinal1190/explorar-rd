import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        // Test basic connection
        await prisma.$connect();

        // Test Account model existence (this will fail if migration didn't run)
        const accountCount = await prisma.account.count();

        // Test AgencyProfile existence
        const agencyCount = await prisma.agencyProfile.count();

        return NextResponse.json({
            status: 'ok',
            message: 'Database connection successful',
            counts: {
                accounts: accountCount,
                agencies: agencyCount
            },
            env: {
                hasGoogleId: !!process.env.AUTH_GOOGLE_ID,
                hasGoogleSecret: !!process.env.AUTH_GOOGLE_SECRET,
                hasAuthSecret: !!process.env.AUTH_SECRET,
            }
        });
    } catch (error: any) {
        console.error("DB Test Error:", error);
        return NextResponse.json({
            status: 'error',
            message: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
