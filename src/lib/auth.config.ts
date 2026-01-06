import type { NextAuthConfig } from "next-auth"

export const authConfig = {
    providers: [],
    pages: {
        signIn: '/login',
    },
    trustHost: true,
    callbacks: {
        async session({ session, token }) {
            if (token && session.user) {
                if (token.sub) session.user.id = token.sub;
                if (token.role) session.user.role = token.role as string;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
            }
            return token;
        }
    },
    session: {
        strategy: "jwt"
    },
} satisfies NextAuthConfig
