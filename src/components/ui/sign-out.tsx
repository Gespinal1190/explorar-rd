"use client";

import { signOut } from "next-auth/react"

export function SignOut() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full py-3 bg-red-50 text-red-600 rounded-2xl text-center font-bold hover:bg-red-100 transition-colors"
        >
            Cerrar Sesión
        </button>
    )
}
