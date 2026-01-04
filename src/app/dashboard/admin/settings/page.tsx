import { auth } from "@/lib/auth";
import { ensurePlansExist, getPlans } from "@/lib/plans";
import AdminSettingsForm from "@/components/dashboard/admin-settings-form";

export default async function AdminSettingsPage() {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') return <div>No autorizado</div>;

    // Ensure plans exist (First run Logic)
    await ensurePlansExist();

    const plans = await getPlans();

    return (
        <div className="max-w-4xl mx-auto py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Configuración y Precios</h1>
            <AdminSettingsForm plans={plans} />
        </div>
    );
}
