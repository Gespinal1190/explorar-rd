import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    const session = await auth();
    if (!session) redirect('/login');

    if (session.user.role === 'AGENCY') {
        redirect('/dashboard/agency');
    } else if (session.user.role === 'ADMIN') {
        redirect('/dashboard/admin');
    } else {
        redirect('/dashboard/user');
    }
}
