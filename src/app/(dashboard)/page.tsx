import { Tv, Film, Database } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground mt-2">
                    Manage your Firebase Firestore content collections.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Link href="/channels">
                    <Card className="hover:border-primary transition-colors cursor-pointer">
                        <CardHeader className="flex flex-row items-center gap-4">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Tv className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <CardTitle>Channels</CardTitle>
                                <CardDescription>TV channels and streaming sources</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Manage TV channels with multiple streaming sources including M3U8 links.
                            </p>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/dracin">
                    <Card className="hover:border-primary transition-colors cursor-pointer">
                        <CardHeader className="flex flex-row items-center gap-4">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Film className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <CardTitle>Dracin</CardTitle>
                                <CardDescription>Asian drama sources</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Manage Asian drama content sources with status tracking.
                            </p>
                        </CardContent>
                    </Card>
                </Link>

                <Card className="border-dashed">
                    <CardHeader className="flex flex-row items-center gap-4">
                        <div className="p-2 bg-muted rounded-lg">
                            <Database className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                            <CardTitle className="text-muted-foreground">More Collections</CardTitle>
                            <CardDescription>Coming soon</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Additional Firestore collections can be added here.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
