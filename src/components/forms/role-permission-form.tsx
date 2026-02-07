"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { rolePermissionSchema, RolePermissionFormData } from "@/lib/validations";
import { RolePermission, CollectionConfig } from "@/types/firestore-schema";
import { getCollectionConfigs } from "@/lib/firestore-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";

interface RolePermissionFormProps {
    initialData?: RolePermission;
    onSubmit: (data: RolePermissionFormData) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

export function RolePermissionForm({ initialData, onSubmit, onCancel, isLoading }: RolePermissionFormProps) {
    const [collections, setCollections] = useState<CollectionConfig[]>([]);
    const isEditMode = !!initialData;

    const form = useForm<RolePermissionFormData>({
        resolver: zodResolver(rolePermissionSchema),
        defaultValues: initialData || {
            id: "",
            name: "",
            description: "",
            allowedCollections: [],
        },
    });

    useEffect(() => {
        async function fetchCollections() {
            const configs = await getCollectionConfigs();
            setCollections(configs);
        }
        fetchCollections();
    }, []);

    const handleSubmit = async (data: RolePermissionFormData) => {
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
                                <FormLabel>Role ID</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="role-id"
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
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Role Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Administrator" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Role description..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="allowedCollections"
                        render={() => (
                            <FormItem>
                                <FormLabel>Allowed Collections</FormLabel>
                                <FormDescription>Select collections this role can access</FormDescription>
                                <div className="space-y-2 mt-2">
                                    {/* Always include settings for admin roles */}
                                    <FormField
                                        control={form.control}
                                        name="allowedCollections"
                                        render={({ field }) => (
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value?.includes("settings")}
                                                        onCheckedChange={(checked) => {
                                                            const current = field.value || [];
                                                            if (checked) {
                                                                field.onChange([...current, "settings"]);
                                                            } else {
                                                                field.onChange(current.filter((v) => v !== "settings"));
                                                            }
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormLabel className="font-normal">Settings</FormLabel>
                                            </FormItem>
                                        )}
                                    />
                                    {collections.map((collection) => (
                                        <FormField
                                            key={collection.id}
                                            control={form.control}
                                            name="allowedCollections"
                                            render={({ field }) => (
                                                <FormItem className="flex items-center space-x-3 space-y-0">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value?.includes(collection.id)}
                                                            onCheckedChange={(checked) => {
                                                                const current = field.value || [];
                                                                if (checked) {
                                                                    field.onChange([...current, collection.id]);
                                                                } else {
                                                                    field.onChange(current.filter((v) => v !== collection.id));
                                                                }
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormLabel className="font-normal">{collection.name}</FormLabel>
                                                </FormItem>
                                            )}
                                        />
                                    ))}
                                </div>
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
                        {isLoading ? "Saving..." : isEditMode ? "Save Changes" : "Create Role"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
