"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { getIconByName } from "@/lib/icons";
import { getEnabledCollectionConfigs, seedInitialData } from "@/lib/firestore-actions";
import { useAuth } from "@/contexts/auth-context";
import type { CollectionConfig } from "@/types/firestore-schema";
import { LayoutDashboard, Settings, Database, Loader2, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Sidebar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const [collections, setCollections] = useState<CollectionConfig[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchCollections() {
            try {
                // Seed initial data if needed
                await seedInitialData();

                // Fetch enabled collections
                const configs = await getEnabledCollectionConfigs();
                setCollections(configs);
            } catch (error) {
                console.error("Failed to fetch collections:", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchCollections();
    }, []);

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-background flex flex-col">
            <div className="flex h-16 items-center border-b px-6">
                <Link href="/" className="flex items-center gap-2">
                    <Database className="h-6 w-6" />
                    <span className="font-semibold text-lg">Firebase CMS</span>
                </Link>
            </div>

            <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
                {/* Dashboard - Always visible */}
                <Link
                    href="/"
                    className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        pathname === "/"
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                </Link>

                {/* Dynamic menu items from Firebase */}
                {isLoading ? (
                    <div className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading...
                    </div>
                ) : (
                    collections.map((item) => {
                        const Icon = getIconByName(item.icon);
                        const isActive = pathname === item.route || pathname.startsWith(item.route + "/");

                        return (
                            <Link
                                key={item.id}
                                href={item.route}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-primary text-primary-foreground"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                {item.name}
                            </Link>
                        );
                    })
                )}

                {/* Settings - Always visible */}
                <div className="pt-4 mt-4 border-t">
                    <Link
                        href="/settings"
                        className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                            pathname === "/settings" || pathname.startsWith("/settings/")
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                    >
                        <Settings className="h-4 w-4" />
                        Settings
                    </Link>
                </div>
            </nav>

            {/* User info and logout */}
            <div className="border-t p-4">
                {user && (
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 px-2">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <User className="h-4 w-4 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{user.displayName}</p>
                                <p className="text-xs text-muted-foreground truncate">{user.role}</p>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={logout}
                        >
                            <LogOut className="h-4 w-4 mr-2" />
                            Logout
                        </Button>
                    </div>
                )}
            </div>
        </aside>
    );
}
