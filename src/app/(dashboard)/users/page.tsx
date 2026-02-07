"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { User } from "@/types/firestore-schema";
import { UserFormData, UserEditFormData } from "@/lib/validations";
import { getUsers, createUser, updateUser, deleteUser } from "@/lib/firestore-actions";
import { PageHeader } from "@/components/layout/page-header";
import { DataTable } from "@/components/tables/data-table";
import { getUserColumns } from "@/components/tables/users-columns";
import { UserForm } from "@/components/forms/user-form";
import { DeleteDialog } from "@/components/dialogs/delete-dialog";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Plus, RefreshCw } from "lucide-react";

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getUsers();
            setUsers(data);
        } catch (error) {
            console.error("Failed to fetch users:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleCreate = () => {
        setSelectedUser(null);
        setIsFormOpen(true);
    };

    const handleEdit = (user: User) => {
        setSelectedUser(user);
        setIsFormOpen(true);
    };

    const handleDelete = (user: User) => {
        setSelectedUser(user);
        setIsDeleteOpen(true);
    };

    const handleFormSubmit = async (data: UserFormData | UserEditFormData) => {
        setIsSaving(true);
        try {
            if (selectedUser) {
                await updateUser(selectedUser.id, data);
            } else {
                await createUser(data as UserFormData);
            }
            setIsFormOpen(false);
            setSelectedUser(null);
            await fetchUsers();
        } catch (error) {
            console.error("Failed to save user:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!selectedUser) return;
        setIsSaving(true);
        try {
            await deleteUser(selectedUser.id);
            setIsDeleteOpen(false);
            setSelectedUser(null);
            await fetchUsers();
        } catch (error) {
            console.error("Failed to delete user:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const columns = useMemo(
        () => getUserColumns({ onEdit: handleEdit, onDelete: handleDelete }),
        []
    );

    return (
        <div className="space-y-6">
            <PageHeader
                title="Users"
                description="Manage user accounts and access permissions."
            >
                <Button variant="outline" size="sm" onClick={fetchUsers} disabled={isLoading}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                    Refresh
                </Button>
                <Button onClick={handleCreate}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add User
                </Button>
            </PageHeader>

            <DataTable
                columns={columns}
                data={users}
                searchKey="displayName"
                searchPlaceholder="Search users..."
            />

            <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
                <SheetContent className="sm:max-w-md px-6">
                    <SheetHeader className="px-0">
                        <SheetTitle>
                            {selectedUser ? "Edit User" : "Add User"}
                        </SheetTitle>
                    </SheetHeader>
                    <div className="mt-6 pb-6">
                        <UserForm
                            initialData={selectedUser || undefined}
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
                title="Delete User"
                description={`Are you sure you want to delete "${selectedUser?.displayName}"? This action cannot be undone.`}
                isLoading={isSaving}
            />
        </div>
    );
}
