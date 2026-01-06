'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import {
    User,
    onAuthStateChanged,
    signInWithPopup,
    signOut as firebaseSignOut,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword
} from 'firebase/auth'
import { auth, googleProvider } from '@/lib/firebase'
import { loginAction, logoutAction } from '@/lib/auth-actions'
import { useRouter } from 'next/navigation'

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    loginWithEmail: (email: string, pass: string) => Promise<void>;
    registerWithEmail: (email: string, pass: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setUser(user)
            setLoading(false)
            if (user) {
                // Optional: Refresh session cookie here if needed
                // For now, we rely on manual login actions to set the cookie
            }
        })
        return () => unsubscribe()
    }, [])

    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider)
            if (result.user && result.user.email) {
                // Call Server Action to set cookie
                await loginAction(result.user.uid, result.user.email)
            }
        } catch (error) {
            console.error("Error logging in with Google", error)
            throw error
        }
    }

    const loginWithEmail = async (email: string, pass: string) => {
        try {
            const result = await signInWithEmailAndPassword(auth, email, pass)
            if (result.user && result.user.email) {
                await loginAction(result.user.uid, result.user.email)
            }
        } catch (error) {
            console.error("Error logging in", error)
            throw error
        }
    }

    const registerWithEmail = async (email: string, pass: string) => {
        try {
            const result = await createUserWithEmailAndPassword(auth, email, pass)
            if (result.user && result.user.email) {
                await loginAction(result.user.uid, result.user.email)
            }
        } catch (error) {
            console.error("Error registering", error)
            throw error
        }
    }

    const logout = async () => {
        try {
            await firebaseSignOut(auth)
            await logoutAction()
        } catch (error) {
            console.error("Error logging out", error)
        }
    }

    return (
        <AuthContext.Provider value={{ user, loading, signInWithGoogle, loginWithEmail, registerWithEmail, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
