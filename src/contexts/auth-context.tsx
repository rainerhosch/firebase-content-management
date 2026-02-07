"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { collection, query, where, getDocs } from "firebase/firestore";
import getFirestoreDb from "@/lib/firebase";

interface AuthUser {
    id: string;
    email: string;
    displayName: string;
    role: string;
}

interface AuthContextType {
    user: AuthUser | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Simple hash function for password verification
 */
async function hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Check for existing session on mount
        const storedUser = localStorage.getItem("auth_user");
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch {
                localStorage.removeItem("auth_user");
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        try {
            // Query Firebase directly from client
            const db = getFirestoreDb();
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("email", "==", email));
            const snapshot = await getDocs(q);

            if (snapshot.empty) {
                return { success: false, error: "Invalid email or password" };
            }

            const userDoc = snapshot.docs[0];
            const userData = userDoc.data();

            // Verify password
            const hashedPassword = await hashPassword(password);
            if (userData.password !== hashedPassword) {
                return { success: false, error: "Invalid email or password" };
            }

            const authUser: AuthUser = {
                id: userDoc.id,
                email: userData.email,
                displayName: userData.displayName,
                role: userData.role,
            };

            setUser(authUser);
            localStorage.setItem("auth_user", JSON.stringify(authUser));
            router.push("/");
            return { success: true };
        } catch (error) {
            console.error("Login error:", error);
            return { success: false, error: "An error occurred during login" };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("auth_user");
        router.push("/login");
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
