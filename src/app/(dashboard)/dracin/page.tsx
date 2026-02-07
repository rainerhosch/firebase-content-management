"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Dracin } from "@/types/firestore-schema";
import { DracinFormData } from "@/lib/validations";
import { getDracins, createDracin, updateDracin, deleteDracin } from "@/lib/firestore-actions";
import { PageHeader } from "@/components/layout/page-header";
import { DataTable } from "@/components/tables/data-table";
import { getDracinColumns } from "@/components/tables/dracin-columns";
import { DracinForm } from "@/components/forms/dracin-form";
import { DeleteDialog } from "@/components/dialogs/delete-dialog";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Plus, RefreshCw } from "lucide-react";

export default function DracinPage() {
    const [dracins, setDracins] = useState<Dracin[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedDracin, setSelectedDracin] = useState<Dracin | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const fetchDracins = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getDracins();
            setDracins(data);
        } catch (error) {
            console.error("Failed to fetch dracins:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDracins();
    }, [fetchDracins]);

    const handleCreate = () => {
        setSelectedDracin(null);
        setIsFormOpen(true);
    };

    const handleEdit = (dracin: Dracin) => {
        setSelectedDracin(dracin);
        setIsFormOpen(true);
    };

    const handleDelete = (dracin: Dracin) => {
        setSelectedDracin(dracin);
        setIsDeleteOpen(true);
    };

    const handleFormSubmit = async (data: DracinFormData) => {
        setIsSaving(true);
        try {
            if (selectedDracin) {
                await updateDracin(selectedDracin.id, data);
            } else {
                await createDracin(data as Dracin);
            }
            setIsFormOpen(false);
            setSelectedDracin(null);
            await fetchDracins();
        } catch (error) {
            console.error("Failed to save dracin:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!selectedDracin) return;
        setIsSaving(true);
        try {
            await deleteDracin(selectedDracin.id);
            setIsDeleteOpen(false);
            setSelectedDracin(null);
            await fetchDracins();
        } catch (error) {
            console.error("Failed to delete dracin:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const columns = useMemo(
        () => getDracinColumns({ onEdit: handleEdit, onDelete: handleDelete }),
        []
    );

    return (
        <div className="space-y-6">
            <PageHeader
                title="Dracin"
                description="Manage Asian drama source entries."
            >
                <Button variant="outline" size="sm" onClick={fetchDracins} disabled={isLoading}>
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
                data={dracins}
                searchKey="name"
                searchPlaceholder="Search entries..."
            />

            <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
                <SheetContent className="sm:max-w-md px-6">
                    <SheetHeader className="px-0">
                        <SheetTitle>
                            {selectedDracin ? "Edit Entry" : "Add Entry"}
                        </SheetTitle>
                    </SheetHeader>
                    <div className="mt-6 pb-6">
                        <DracinForm
                            initialData={selectedDracin || undefined}
                            onSubmit={handleFormSubmit}
                            onCancel={() => setIsFormOpen(false)}
                            isLoading={isSaving}
                        />
                    </div>
                </SheetContent>
            </Sheet>

            <DeleteDialog
                open={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
                onConfirm={handleDeleteConfirm}
                title="Delete Entry"
                description={`Are you sure you want to delete "${selectedDracin?.name}"? This action cannot be undone.`}
                isLoading={isSaving}
            />
        </div>
    );
}
