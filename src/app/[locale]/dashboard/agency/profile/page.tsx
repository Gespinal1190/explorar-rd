import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import AgencyProfileForm from "@/components/dashboard/agency-profile-form";
import ProfileEditForm from "@/components/dashboard/profile-edit-form";
import BankAccountsManager from "@/components/dashboard/bank-accounts-manager";
import { redirect } from "next/navigation";

export default async function AgencyProfilePage() {
    const session = await auth();
    const userRole = session?.user?.role;
    const sessionUserId = session?.user?.id;

    if (!sessionUserId || userRole !== "AGENCY") {
        redirect("/dashboard");
        return null;
    }

    const [agency, user] = await Promise.all([
        prisma.agencyProfile.findUnique({
            where: { userId: sessionUserId },
            include: {
                // @ts-ignore - bankAccounts relation exists but client is stale
                bankAccounts: true
            }
        }),
        prisma.user.findUnique({
            where: { id: sessionUserId }
        })
    ]);

    if (!agency || !user) {
        return <div>No se encontró el perfil.</div>;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-12 pb-12">

            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-gray-900">Configuración de Cuenta</h1>
                <p className="text-gray-500">Gestiona los datos de tu empresa y tu acceso personal.</p>
            </div>

            {/* Public Section */}
            <section className="space-y-6">
                <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary text-2xl">
                        🏢
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Perfil de Empresa (Público)</h2>
                        <p className="text-sm text-gray-500">Esta información es visible para los viajeros.</p>
                    </div>
                </div>
                <AgencyProfileForm agency={agency} />

                {/* Bank Accounts Section nested or related to company */}
                <div className="pt-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Cuentas Bancarias</h3>
                    <BankAccountsManager accounts={agency.bankAccounts} />
                </div>
            </section>

            {/* Private Section */}
            <section className="space-y-6 pt-6 bg-gray-50 p-6 rounded-3xl border border-dashed border-gray-200">
                <div className="flex items-center gap-4 border-b border-gray-200 pb-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-gray-700 text-2xl shadow-sm">
                        🔒
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Mi Perfil (Privado)</h2>
                        <p className="text-sm text-gray-500">Tus datos de acceso y seguridad como administrador.</p>
                    </div>
                </div>
                <ProfileEditForm user={user} />
            </section>
        </div>
    );
}
