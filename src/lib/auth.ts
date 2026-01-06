import { getSession } from "@/lib/session";
import { logoutAction } from "@/lib/auth-actions";
import { redirect } from "next/navigation";

export async function auth() {
    const session = await getSession();

    // Return null if no session or user ID
    if (!session?.userId) return null;

    // Format closer to NextAuth Session shape if needed
    // Note: 'image' is not in our cookie, so it will be null unless we fetch user
    return {
        user: {
            id: session.userId as string,
            email: session.email as string,
            role: session.role as string,
            name: (session.email as string)?.split('@')[0], // Simple fallback
            image: null,
        }
    };
}

// Deprecated or redirecting stubs for functions previously exported by NextAuth
export async function signIn() {
    redirect('/login');
}

export async function signOut() {
    await logoutAction();
}
