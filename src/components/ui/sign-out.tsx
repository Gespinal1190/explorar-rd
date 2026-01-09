"use client";

import { useAuth } from "@/contexts/AuthContext";

import { useTranslations } from "next-intl";

export function SignOut() {
    const { logout } = useAuth();
    const t = useTranslations("Navbar");

    return (
        <button
            onClick={() => logout()}
            className="w-full py-3 bg-red-50 text-red-600 rounded-2xl text-center font-bold hover:bg-red-100 transition-colors"
        >
            {t('logout') || "Cerrar Sesión"}
        </button>
    )
}
