import TourForm from "@/components/dashboard/tour-form";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function NewTourPage() {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        redirect('/login');
    }

    const agency = await prisma.agencyProfile.findUnique({
        where: { userId: userId }
    });

    if (!agency || agency.status !== 'ACTIVE') {
        redirect('/dashboard/agency/tours');
    }

    return (
        <div className="container mx-auto">
            <h1 className="text-2xl font-bold mb-6">Nuevo Tour</h1>
            <TourForm />
        </div>
    );
}
