"use client";

import { useState, useEffect, useCallback } from "react";
import { CollectionConfig, RolePermission } from "@/types/firestore-schema";
import { CollectionConfigFormData, RolePermissionFormData } from "@/lib/validations";
import {
    getCollectionConfigs,
    createCollectionConfig,
    updateCollectionConfig,
    deleteCollectionConfig,
    getRolePermissions,
    createRolePermission,
    updateRolePermission,
    deleteRolePermission,
} from "@/lib/firestore-actions";
import { PageHeader } from "@/components/layout/page-header";
import { CollectionConfigForm } from "@/components/forms/collection-config-form";
import { RolePermissionForm } from "@/components/forms/role-permission-form";
import { DeleteDialog } from "@/components/dialogs/delete-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pencil, Trash2, RefreshCw, GripVertical } from "lucide-react";
import { getIconByName } from "@/lib/icons";

export default function SettingsPage() {
    // Collections state
    const [collections, setCollections] = useState<CollectionConfig[]>([]);
    const [isCollectionFormOpen, setIsCollectionFormOpen] = useState(false);
    const [isCollectionDeleteOpen, setIsCollectionDeleteOpen] = useState(false);
    const [selectedCollection, setSelectedCollection] = useState<CollectionConfig | null>(null);

    // Roles state
    const [roles, setRoles] = useState<RolePermission[]>([]);
    const [isRoleFormOpen, setIsRoleFormOpen] = useState(false);
    const [isRoleDeleteOpen, setIsRoleDeleteOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<RolePermission | null>(null);

    // Common state
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [collectionsData, rolesData] = await Promise.all([
                getCollectionConfigs(),
                getRolePermissions(),
            ]);
            setCollections(collectionsData);
            setRoles(rolesData);
        } catch (error) {
            console.error("Failed to fetch settings:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Collection handlers
    const handleCreateCollection = () => {
        setSelectedCollection(null);
        setIsCollectionFormOpen(true);
    };

    const handleEditCollection = (collection: CollectionConfig) => {
        setSelectedCollection(collection);
        setIsCollectionFormOpen(true);
    };

    const handleDeleteCollection = (collection: CollectionConfig) => {
        setSelectedCollection(collection);
        setIsCollectionDeleteOpen(true);
    };

    const handleCollectionFormSubmit = async (data: CollectionConfigFormData) => {
        setIsSaving(true);
        try {
            if (selectedCollection) {
                await updateCollectionConfig(selectedCollection.id, data);
            } else {
                await createCollectionConfig(data as CollectionConfig);
            }
            setIsCollectionFormOpen(false);
            setSelectedCollection(null);
            await fetchData();
        } catch (error) {
            console.error("Failed to save collection:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCollectionDeleteConfirm = async () => {
        if (!selectedCollection) return;
        setIsSaving(true);
        try {
            await deleteCollectionConfig(selectedCollection.id);
            setIsCollectionDeleteOpen(false);
            setSelectedCollection(null);
            await fetchData();
        } catch (error) {
            console.error("Failed to delete collection:", error);
        } finally {
            setIsSaving(false);
        }
    };

    // Role handlers
    const handleCreateRole = () => {
        setSelectedRole(null);
        setIsRoleFormOpen(true);
    };

    const handleEditRole = (role: RolePermission) => {
        setSelectedRole(role);
        setIsRoleFormOpen(true);
    };

    const handleDeleteRole = (role: RolePermission) => {
        setSelectedRole(role);
        setIsRoleDeleteOpen(true);
    };

    const handleRoleFormSubmit = async (data: RolePermissionFormData) => {
        setIsSaving(true);
        try {
            if (selectedRole) {
                await updateRolePermission(selectedRole.id, data);
            } else {
                await createRolePermission(data as RolePermission);
            }
            setIsRoleFormOpen(false);
            setSelectedRole(null);
            await fetchData();
        } catch (error) {
            console.error("Failed to save role:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleRoleDeleteConfirm = async () => {
        if (!selectedRole) return;
        setIsSaving(true);
        try {
            await deleteRolePermission(selectedRole.id);
            setIsRoleDeleteOpen(false);
            setSelectedRole(null);
            await fetchData();
        } catch (error) {
            console.error("Failed to delete role:", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Settings"
                description="Manage collections, roles, and system configuration."
            >
                <Button variant="outline" size="sm" onClick={fetchData} disabled={isLoading}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                    Refresh
                </Button>
            </PageHeader>

            <Tabs defaultValue="collections">
                <TabsList className="mb-4">
                    <TabsTrigger value="collections">Collections</TabsTrigger>
                    <TabsTrigger value="roles">Role Permissions</TabsTrigger>
                </TabsList>

                <TabsContent value="collections" className="space-y-4">
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-muted-foreground">
                            Configure which collections appear in the sidebar menu.
                        </p>
                        <Button onClick={handleCreateCollection}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Collection
                        </Button>
                    </div>

                    <div className="grid gap-4">
                        {collections.map((collection) => {
                            const Icon = getIconByName(collection.icon);
                            return (
                                <Card key={collection.id}>
                                    <CardHeader className="py-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <GripVertical className="h-4 w-4" />
                                                    <Icon className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <CardTitle className="text-base">{collection.name}</CardTitle>
                                                    <CardDescription className="text-xs">
                                                        {collection.route} | Order: {collection.order}
                                                    </CardDescription>
                                                </div>
                                                <Badge variant={collection.enabled ? "default" : "secondary"}>
                                                    {collection.enabled ? "Enabled" : "Disabled"}
                                                </Badge>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleEditCollection(collection)}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-destructive hover:text-destructive"
                                                    onClick={() => handleDeleteCollection(collection)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardHeader>
                                </Card>
                            );
                        })}
                    </div>
                </TabsContent>

                <TabsContent value="roles" className="space-y-4">
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-muted-foreground">
                            Define roles and their access permissions.
                        </p>
                        <Button onClick={handleCreateRole}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Role
                        </Button>
                    </div>

                    <div className="grid gap-4">
                        {roles.map((role) => (
                            <Card key={role.id}>
                                <CardHeader className="py-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="text-base">{role.name}</CardTitle>
                                            <CardDescription className="text-xs">
                                                {role.description || "No description"}
                                            </CardDescription>
                                            <div className="flex gap-1 mt-2">
                                                {role.allowedCollections.map((col) => (
                                                    <Badge key={col} variant="outline" className="text-xs">
                                                        {col}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleEditRole(role)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-destructive hover:text-destructive"
                                                onClick={() => handleDeleteRole(role)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>

            {/* Collection Form Sheet */}
            <Sheet open={isCollectionFormOpen} onOpenChange={setIsCollectionFormOpen}>
                <SheetContent className="sm:max-w-lg px-6 overflow-y-auto">
                    <SheetHeader className="px-0">
                        <SheetTitle>
                            {selectedCollection ? "Edit Collection" : "Add Collection"}
                        </SheetTitle>
                    </SheetHeader>
                    <div className="mt-6 pb-6">
                        <CollectionConfigForm
                            initialData={selectedCollection || undefined}
                            onSubmit={handleCollectionFormSubmit}
                            onCancel={() => setIsCollectionFormOpen(false)}
                            isLoading={isSaving}
                        />
                    </div>
                </SheetContent>
            </Sheet>

            {/* Role Form Sheet */}
            <Sheet open={isRoleFormOpen} onOpenChange={setIsRoleFormOpen}>
                <SheetContent className="sm:max-w-md px-6">
                    <SheetHeader className="px-0">
                        <SheetTitle>
                            {selectedRole ? "Edit Role" : "Add Role"}
                        </SheetTitle>
                    </SheetHeader>
                    <div className="mt-6 pb-6">
                        <RolePermissionForm
                            initialData={selectedRole || undefined}
                            onSubmit={handleRoleFormSubmit}
                            onCancel={() => setIsRoleFormOpen(false)}
                            isLoading={isSaving}
                        />
                    </div>
                </SheetContent>
            </Sheet>

            {/* Delete Dialogs */}
            <DeleteDialog
                open={isCollectionDeleteOpen}
                onOpenChange={setIsCollectionDeleteOpen}
                onConfirm={handleCollectionDeleteConfirm}
                title="Delete Collection"
                description={`Are you sure you want to delete "${selectedCollection?.name}"? This will remove it from the sidebar menu.`}
                isLoading={isSaving}
            />

            <DeleteDialog
                open={isRoleDeleteOpen}
                onOpenChange={setIsRoleDeleteOpen}
                onConfirm={handleRoleDeleteConfirm}
                title="Delete Role"
                description={`Are you sure you want to delete the "${selectedRole?.name}" role? Users with this role may lose access.`}
                isLoading={isSaving}
            />
        </div>
    );
}
