import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import TourForm from "@/components/dashboard/tour-form";
import { notFound, redirect } from "next/navigation";

export default async function EditTourPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if (!session || session.user.role !== 'AGENCY') {
        redirect('/dashboard/agency/tours');
    }

    const { id } = await params;

    const agency = await prisma.agencyProfile.findUnique({
        where: { userId: session.user.id }
    });

    if (!agency) {
        redirect('/dashboard/agency/profile');
    }

    // Use findFirst because we are filtering by a non-unique combination (ID + AgencyID)
    // to ensure the agency owns the tour.
    const tour = await prisma.tour.findFirst({
        where: {
            id: id,
            agencyId: agency.id
        },
        include: {
            images: true
        }
    });

    if (!tour) {
        notFound();
    }

    return <TourForm initialData={tour} isEditing={true} />;
}
