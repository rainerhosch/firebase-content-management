import { NextResponse } from "next/server";
import { collection, query, where, getDocs } from "firebase/firestore";
import getFirestoreDb from "@/lib/firebase";

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

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        const db = getFirestoreDb();
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", email));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            return NextResponse.json(
                { error: "Invalid email or password" },
                { status: 401 }
            );
        }

        const userDoc = snapshot.docs[0];
        const userData = userDoc.data();

        // Verify password
        const hashedPassword = await hashPassword(password);
        if (userData.password !== hashedPassword) {
            return NextResponse.json(
                { error: "Invalid email or password" },
                { status: 401 }
            );
        }

        // Return user data (excluding password)
        return NextResponse.json({
            user: {
                id: userDoc.id,
                email: userData.email,
                displayName: userData.displayName,
                role: userData.role,
            },
        });
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { error: "An error occurred during login" },
            { status: 500 }
        );
    }
}
