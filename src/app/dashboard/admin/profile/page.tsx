import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import ProfileEditForm from "@/components/dashboard/profile-edit-form";

export default async function AdminProfilePage() {
    const session = await auth();

    if (!session || session.user.role !== 'ADMIN') {
        redirect("/dashboard");
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black text-gray-900">Mi Perfil</h1>
                <p className="text-gray-500">Gestiona tus datos de administrador y seguridad.</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <ProfileEditForm user={session.user} />
            </div>
        </div>
    );
}
