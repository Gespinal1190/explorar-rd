
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import AgencyProfileForm from "@/components/dashboard/agency-profile-form";
import { redirect } from "next/navigation";

export default async function AgencyProfilePage() {
    const session = await auth();
    if (!session || session.user.role !== "AGENCY") {
        redirect("/dashboard");
    }

    const agency = await prisma.agencyProfile.findUnique({
        where: { userId: session.user.id },
        include: { bankAccounts: true }
    });

    if (!agency) {
        return <div>No se encontró el perfil de la agencia.</div>;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-primary/10 rounded-2xl flex items-center justify-center text-primary text-4xl shadow-sm">
                    🏢
                </div>
                <div>
                    <h1 className="text-3xl font-black text-gray-900">Perfil de Empresa</h1>
                    <p className="text-gray-500">Gestiona la información pública de tu agencia</p>
                </div>
            </div>

            <AgencyProfileForm agency={agency} />

            <BankAccountsManager accounts={agency.bankAccounts} />
        </div>
    );
}

import BankAccountsManager from "@/components/dashboard/bank-accounts-manager";
