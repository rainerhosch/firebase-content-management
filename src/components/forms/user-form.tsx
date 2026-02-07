"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema, userEditSchema, UserFormData, UserEditFormData } from "@/lib/validations";
import { User, RolePermission } from "@/types/firestore-schema";
import { getRolePermissions } from "@/lib/firestore-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface UserFormProps {
    initialData?: User;
    onSubmit: (data: UserFormData | UserEditFormData) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

export function UserForm({ initialData, onSubmit, onCancel, isLoading }: UserFormProps) {
    const [roles, setRoles] = useState<RolePermission[]>([]);
    const isEditMode = !!initialData;

    const form = useForm<UserFormData | UserEditFormData>({
        resolver: zodResolver(isEditMode ? userEditSchema : userSchema),
        defaultValues: initialData
            ? {
                id: initialData.id,
                email: initialData.email,
                password: "",
                displayName: initialData.displayName,
                role: initialData.role,
            }
            : {
                id: "",
                email: "",
                password: "",
                displayName: "",
                role: "",
            },
    });

    useEffect(() => {
        async function fetchRoles() {
            const roleData = await getRolePermissions();
            setRoles(roleData);
        }
        fetchRoles();
    }, []);

    const handleSubmit = async (data: UserFormData | UserEditFormData) => {
        await onSubmit(data);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="id"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>User ID</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="user-id"
                                        {...field}
                                        disabled={isEditMode}
                                        className={cn(isEditMode && "bg-muted")}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="displayName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Display Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="John Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="user@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{isEditMode ? "New Password (leave empty to keep current)" : "Password"}</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="********" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Role</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a role" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {roles.map((role) => (
                                            <SelectItem key={role.id} value={role.id}>
                                                {role.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Saving..." : isEditMode ? "Save Changes" : "Create User"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
