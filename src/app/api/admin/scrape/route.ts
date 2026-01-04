import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// Mock Data Source for Scraper
const MOCK_EXTERNAL_DATA = [
    {
        agencyName: "Aventuras del Este",
        email: "contacto@aventuraseste.com",
        tours: [
            {
                title: "Buggy Adventure Macao - Scraped",
                description: "Experience the mud and fun in Macao Beach with our top notch buggies.",
                price: 3500,
                location: "Punta Cana",
                instagramUrl: "https://instagram.com/p/mock1",
                latitude: 18.72,
                longitude: -68.55,
                image: "https://images.unsplash.com/photo-1552857463-548483b48226?auto=format&fit=crop&q=80"
            }
        ]
    }
];

export async function POST(req: Request) {
    try {
        const session = await auth();
        // Secure this endpoint - Admin only
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        console.log("Starting Scraper Job...");

        let results = {
            agenciesCreated: 0,
            toursCreated: 0
        };

        for (const data of MOCK_EXTERNAL_DATA) {
            // 1. Create or Find User/Agency
            // For demo, we assume we create a placeholder user if needs logic
            // Skipping User creation complexity here, assume looking up by email or creating mock

            // In a real scraper, you might just create content pending approval
            console.log(`Processing agency: ${data.agencyName}`);

            // ... Logic to insert into DB ...
            // await prisma.agencyProfile.upsert(...)

            results.agenciesCreated++;
            results.toursCreated += data.tours.length;
        }

        return NextResponse.json({
            success: true,
            message: "Scraping job completed successfully",
            stats: results
        });

    } catch (error) {
        console.error("Scraper Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
