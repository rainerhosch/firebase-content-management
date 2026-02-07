"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, notFound } from "next/navigation";
import type { CollectionConfig, DynamicDocument } from "@/types/firestore-schema";
import {
    getCollectionConfig,
    getDynamicDocuments,
    createDynamicDocument,
    updateDynamicDocument,
    deleteDynamicDocument,
} from "@/lib/firestore-actions";
import { PageHeader } from "@/components/layout/page-header";
import { DataTable } from "@/components/tables/data-table";
import { getDynamicColumns } from "@/components/tables/dynamic-columns";
import { DynamicForm } from "@/components/forms/dynamic-form";
import { DeleteDialog } from "@/components/dialogs/delete-dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Plus, RefreshCw, AlertCircle, Settings } from "lucide-react";
import Link from "next/link";

export default function DynamicCollectionPage() {
    const params = useParams();
    const collectionId = params.collection as string;

    const [config, setConfig] = useState<CollectionConfig | null>(null);
    const [documents, setDocuments] = useState<DynamicDocument[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState<DynamicDocument | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const collectionConfig = await getCollectionConfig(collectionId);

            if (!collectionConfig) {
                setConfig(null);
                setError("Collection not found");
                return;
            }

            // System collections (channels, dracin, users) use their own pages
            if (collectionConfig.isSystem) {
                setConfig(collectionConfig);
                setError("system");
                return;
            }

            setConfig(collectionConfig);

            const docs = await getDynamicDocuments(collectionId);
            setDocuments(docs);
        } catch (err) {
            console.error("Failed to fetch data:", err);
            setError("Failed to load collection");
        } finally {
            setIsLoading(false);
        }
    }, [collectionId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleCreate = () => {
        setSelectedDoc(null);
        setIsFormOpen(true);
    };

    const handleEdit = (doc: DynamicDocument) => {
        setSelectedDoc(doc);
        setIsFormOpen(true);
    };

    const handleDelete = (doc: DynamicDocument) => {
        setSelectedDoc(doc);
        setIsDeleteOpen(true);
    };

    const handleFormSubmit = async (data: DynamicDocument) => {
        setIsSaving(true);
        try {
            if (selectedDoc) {
                await updateDynamicDocument(collectionId, selectedDoc.id, data);
            } else {
                await createDynamicDocument(collectionId, data);
            }
            setIsFormOpen(false);
            setSelectedDoc(null);
            await fetchData();
        } catch (err) {
            console.error("Failed to save document:", err);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!selectedDoc) return;
        setIsSaving(true);
        try {
            await deleteDynamicDocument(collectionId, selectedDoc.id);
            setIsDeleteOpen(false);
            setSelectedDoc(null);
            await fetchData();
        } catch (err) {
            console.error("Failed to delete document:", err);
        } finally {
            setIsSaving(false);
        }
    };

    const columns = useMemo(
        () => config?.fields ? getDynamicColumns({
            fields: config.fields,
            onEdit: handleEdit,
            onDelete: handleDelete
        }) : [],
        [config?.fields]
    );

    // System collection - redirect hint
    if (error === "system" && config) {
        return (
            <div className="space-y-6">
                <PageHeader
                    title={config.name}
                    description="This is a system collection with a dedicated page."
                />
                <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>System Collection</AlertTitle>
                    <AlertDescription>
                        This collection has a dedicated management page. Please use the menu to navigate there.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    // Collection not found
    if (!isLoading && !config) {
        return (
            <div className="space-y-6">
                <PageHeader
                    title="Collection Not Found"
                    description="This collection does not exist or has not been configured."
                />
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        The collection &quot;{collectionId}&quot; was not found. Please check the Settings page to configure it.
                    </AlertDescription>
                </Alert>
                <Button asChild>
                    <Link href="/settings">
                        <Settings className="h-4 w-4 mr-2" />
                        Go to Settings
                    </Link>
                </Button>
            </div>
        );
    }

    // No fields defined
    if (config && (!config.fields || config.fields.length === 0)) {
        return (
            <div className="space-y-6">
                <PageHeader
                    title={config.name}
                    description="This collection needs field definitions."
                />
                <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>No Fields Defined</AlertTitle>
                    <AlertDescription>
                        This collection has no fields configured. Please add fields in Settings to start managing data.
                    </AlertDescription>
                </Alert>
                <Button asChild>
                    <Link href="/settings">
                        <Settings className="h-4 w-4 mr-2" />
                        Configure Fields
                    </Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title={config?.name || "Loading..."}
                description={`Manage ${config?.name || "collection"} entries.`}
            >
                <Button variant="outline" size="sm" onClick={fetchData} disabled={isLoading}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                    Refresh
                </Button>
                <Button onClick={handleCreate}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Entry
                </Button>
            </PageHeader>

            <DataTable
                columns={columns}
                data={documents}
                searchKey={config?.fields?.[0]?.name || "id"}
                searchPlaceholder={`Search ${config?.name || "entries"}...`}
            />

            <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
                <SheetContent className="sm:max-w-md px-6 overflow-y-auto">
                    <SheetHeader className="px-0">
                        <SheetTitle>
                            {selectedDoc ? "Edit Entry" : "Add Entry"}
                        </SheetTitle>
                    </SheetHeader>
                    <div className="mt-6 pb-6">
                        {config?.fields && (
                            <DynamicForm
                                fields={config.fields}
                                initialData={selectedDoc || undefined}
                                onSubmit={handleFormSubmit}
                                onCancel={() => setIsFormOpen(false)}
                                isLoading={isSaving}
                            />
                        )}
                    </div>
                </SheetContent>
            </Sheet>

            <DeleteDialog
                open={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
                onConfirm={handleDeleteConfirm}
                title="Delete Entry"
                description={`Are you sure you want to delete this entry? This action cannot be undone.`}
                isLoading={isSaving}
            />
        </div>
    );
}
