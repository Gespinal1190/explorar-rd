import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"

async function getUser(email: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { email },
            include: { agencyProfile: true }
        });
        return user;
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
    debug: true,
    secret: process.env.AUTH_SECRET || "secret_random_password_123",
    adapter: PrismaAdapter(prisma),
    pages: {
        signIn: '/login',
    },
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
            allowDangerousEmailAccountLinking: true
        }),
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    const user = await getUser(email);
                    if (!user) return null;

                    if (!user.password) return null;

                    // In real app, use bcrypt.compare
                    // For seed data compatibility (which is plain text "password123"), we check both
                    const passwordsMatch = await bcrypt.compare(password, user.password);
                    const isPlainTextMatch = password === user.password; // Fallback for seed data

                    if (passwordsMatch || isPlainTextMatch) return user;
                }

                console.log('Invalid credentials');
                return null;
            },
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
                // Fetch role again or store in token
                const user = await prisma.user.findUnique({ where: { id: token.sub } });
                if (user) {
                    session.user.role = user.role;
                }
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
})
