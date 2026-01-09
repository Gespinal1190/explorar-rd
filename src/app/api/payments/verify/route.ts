
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { orderId, payerId, amount, currency, type, metadata, agencyId } = body;

        if (!orderId || !agencyId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // 1. Record Payment in DB
        const payment = await (prisma as any).payment.create({
            data: {
                agencyProfileId: agencyId,
                amount: parseFloat(amount),
                currency: currency || "USD",
                type: type, // 'MEMBERSHIP_PRO' or 'AD_PROMOTION'
                status: "COMPLETED",
                paypalOrderId: orderId,
                paypalPayerId: payerId,
                metadata: JSON.stringify(metadata)
            }
        });

        // 2. Activate Benefits based on Type
        if (type === "MEMBERSHIP_PRO") {
            const now = new Date();
            const expiresAt = new Date(now.setFullYear(now.getFullYear() + 1));

            await prisma.agencyProfile.update({
                where: { id: agencyId },
                data: {
                    tier: "PRO",
                    tierExpiresAt: expiresAt
                }
            });
        } else if (type === "AD_PROMOTION") {
            const { tourId, planSlug } = metadata;

            if (!tourId || !planSlug) {
                return NextResponse.json({ error: "Missing metadata for promotion" }, { status: 400 });
            }

            // Fetch plan to get duration
            const plan = await (prisma as any).plan.findUnique({
                where: { slug: planSlug }
            });

            if (!plan) {
                return NextResponse.json({ error: "Invalid promotion plan" }, { status: 400 });
            }

            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + plan.durationDays);

            await prisma.tour.update({
                where: { id: tourId },
                data: {
                    featuredPlan: plan.slug,
                    featuredExpiresAt: expiresAt
                } as any
            });
        }

        return NextResponse.json({ success: true, paymentId: payment.id });

    } catch (error) {
        console.error("Payment Verification Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
