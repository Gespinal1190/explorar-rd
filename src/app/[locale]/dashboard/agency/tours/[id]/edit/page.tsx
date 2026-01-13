import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import TourForm from "@/components/dashboard/tour-form";
import { notFound, redirect } from "next/navigation";

export default async function EditTourPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    const user = session?.user;
    if (!user || user.role !== 'AGENCY') {
        redirect('/dashboard/agency/tours');
        return null;
    }

    const { id } = await params;

    const agency = await prisma.agencyProfile.findUnique({
        where: { userId: user.id }
    });

    if (!agency) {
        redirect('/dashboard/agency/profile');
    }

    if (agency.status !== 'ACTIVE') {
        // Option 1: Redirect
        // redirect('/dashboard/agency/tours');
        // Option 2: SHow Blocked Form (better UX so they know WHY)
    }

    // Use findFirst because we are filtering by a non-unique combination (ID + AgencyID)
    // to ensure the agency owns the tour.
    const tour = await prisma.tour.findFirst({
        where: {
            id: id,
            agencyId: agency.id
        },
        include: {
            images: true,
            dates: true // Include dates for editing
        }
    });

    if (!tour) {
        notFound();
    }

    return <TourForm initialData={tour} isEditing={true} agencyStatus={agency.status} />;
}
