"use client";

import { useAuth } from "@/contexts/AuthContext";

export function SignOut() {
    const { logout } = useAuth();

    return (
        <button
            onClick={() => logout()}
            className="w-full py-3 bg-red-50 text-red-600 rounded-2xl text-center font-bold hover:bg-red-100 transition-colors"
        >
            Cerrar Sesión
        </button>
    )
}
