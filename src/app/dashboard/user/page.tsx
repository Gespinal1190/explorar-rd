import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import ProfileEditForm from "@/components/dashboard/profile-edit-form";

export default async function UserProfilePage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/login");

    const user = await prisma.user.findUnique({
        where: { id: session.user.id }
    });

    if (!user) return <div>Usuario no encontrado</div>;

    return (
        <div className="max-w-4xl">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-6 mb-8">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary text-3xl font-black">
                        {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Mi Perfil</h1>
                        <p className="text-gray-500">Administra tu información personal</p>
                    </div>
                </div>

                <ProfileEditForm user={user} />
            </div>
        </div>
    );
}
