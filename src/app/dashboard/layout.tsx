import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardMobileNav } from "@/components/dashboard/dashboard-mobile-nav";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const session = await auth();
    if (!session) redirect('/login');

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
            {/* Mobile Navigation (Visible only on mobile) */}
            <DashboardMobileNav userRole={session.user.role} userName={session.user.name} />

            {/* Desktop Sidebar (Hidden on mobile) */}
            <aside className="w-72 hidden md:block flex-shrink-0 h-screen sticky top-0">
                <DashboardSidebar userRole={session.user.role} userName={session.user.name} />
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-x-hidden p-4 md:p-8 lg:p-10 w-full">
                {children}
            </main>
        </div>
    );
}
