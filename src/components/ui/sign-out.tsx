import { signOut } from "@/lib/auth"

export function SignOut() {
    return (
        <form
            action={async () => {
                "use server"
                await signOut({ redirectTo: "/" })
            }}
        >
            <button type="submit" className="text-sm font-medium hover:text-primary transition-colors">
                Cerrar Sesión
            </button>
        </form>
    )
}
