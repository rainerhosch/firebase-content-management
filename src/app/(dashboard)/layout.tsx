"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { ProtectedRoute } from "@/components/auth/protected-route";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-background">
                <Sidebar />
                <main className="pl-64">
                    <div className="container mx-auto px-6 py-8">{children}</div>
                </main>
            </div>
        </ProtectedRoute>
    );
}
