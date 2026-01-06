import Link from "next/link";
import { verifySession } from "@/lib/session";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardMobileNav } from "@/components/dashboard/dashboard-mobile-nav";
import prisma from "@/lib/prisma"; // Import Prisma

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const session = await verifySession();
    if (!session) redirect('/login');

    // Fetch full user data including phone
    const user = await prisma.user.findUnique({
        where: { email: session.email || '' },
        select: { phone: true, name: true, role: true }
    });

    const userPhone = user?.phone;
    // Use DB name if available, fallback isn't really possible from session email alone easily without query above.
    const userName = user?.name || session.email?.split('@')[0] || 'Usuario';

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
            {/* Mobile Navigation (Visible only on mobile) */}
            <div className="md:hidden">
                <DashboardMobileNav userRole={session.role} userName={userName} userPhone={userPhone} />
            </div>

            {/* Desktop Sidebar (Hidden on mobile) */}
            <aside className="w-72 hidden md:block flex-shrink-0 h-screen sticky top-0">
                <DashboardSidebar userRole={session.role} userName={userName} userPhone={userPhone} />
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-x-hidden p-4 md:p-8 lg:p-10 w-full">
                {children}
            </main>
        </div>
    );
}
