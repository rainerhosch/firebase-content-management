"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { collectionConfigSchema, CollectionConfigFormData } from "@/lib/validations";
import { CollectionConfig, FieldType } from "@/types/firestore-schema";
import { getAvailableIconNames, getIconByName } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Plus, Trash2 } from "lucide-react";

interface CollectionConfigFormProps {
    initialData?: CollectionConfig;
    onSubmit: (data: CollectionConfigFormData) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

const FIELD_TYPES: { value: FieldType; label: string }[] = [
    { value: "text", label: "Text" },
    { value: "textarea", label: "Textarea" },
    { value: "url", label: "URL" },
    { value: "number", label: "Number" },
    { value: "boolean", label: "Boolean" },
    { value: "select", label: "Select" },
];

export function CollectionConfigForm({ initialData, onSubmit, onCancel, isLoading }: CollectionConfigFormProps) {
    const isEditMode = !!initialData;
    const isSystemCollection = initialData?.isSystem;
    const iconNames = getAvailableIconNames();

    const form = useForm<CollectionConfigFormData>({
        resolver: zodResolver(collectionConfigSchema),
        defaultValues: initialData || {
            id: "",
            name: "",
            icon: "Database",
            route: "/",
            order: 0,
            enabled: true,
            fields: [],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "fields",
    });

    const handleSubmit = async (data: CollectionConfigFormData) => {
        await onSubmit(data);
    };

    const addField = () => {
        append({
            name: "",
            label: "",
            type: "text",
            required: false,
            options: [],
            placeholder: "",
        });
    };

    const selectedIcon = form.watch("icon");
    const IconComponent = getIconByName(selectedIcon);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="id"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Collection ID</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="my-collection"
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
                                <FormLabel>Display Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="My Collection" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="icon"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Icon</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <div className="flex items-center gap-2">
                                                <IconComponent className="h-4 w-4" />
                                                <SelectValue placeholder="Select an icon" />
                                            </div>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {iconNames.map((iconName) => {
                                            const Icon = getIconByName(iconName);
                                            return (
                                                <SelectItem key={iconName} value={iconName}>
                                                    <div className="flex items-center gap-2">
                                                        <Icon className="h-4 w-4" />
                                                        <span>{iconName}</span>
                                                    </div>
                                                </SelectItem>
                                            );
                                        })}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="route"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Route</FormLabel>
                                <FormControl>
                                    <Input placeholder="/my-collection" {...field} />
                                </FormControl>
                                <FormDescription>URL path for this collection page</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="order"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Order</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        {...field}
                                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                    />
                                </FormControl>
                                <FormDescription>Display order in the sidebar menu</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="enabled"
                        render={({ field }) => (
                            <FormItem className="flex items-center justify-between rounded-lg border p-3">
                                <div className="space-y-0.5">
                                    <FormLabel>Enabled</FormLabel>
                                    <FormDescription>Show this collection in the sidebar</FormDescription>
                                </div>
                                <FormControl>
                                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                {/* Fields Editor - only for non-system collections */}
                {!isSystemCollection && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="text-sm font-medium">Collection Fields</h4>
                                <p className="text-xs text-muted-foreground">
                                    Define the structure of documents in this collection
                                </p>
                            </div>
                            <Button type="button" variant="outline" size="sm" onClick={addField}>
                                <Plus className="h-4 w-4 mr-1" />
                                Add Field
                            </Button>
                        </div>

                        {fields.length === 0 && (
                            <div className="text-center py-6 border rounded-lg border-dashed">
                                <p className="text-sm text-muted-foreground">
                                    No fields defined. Click &quot;Add Field&quot; to start.
                                </p>
                            </div>
                        )}

                        {fields.map((fieldItem, index) => (
                            <Card key={fieldItem.id}>
                                <CardHeader className="py-3 px-4">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-sm">Field {index + 1}</CardTitle>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="text-destructive hover:text-destructive"
                                            onClick={() => remove(index)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="px-4 pb-4 space-y-3">
                                    <div className="grid grid-cols-2 gap-3">
                                        <FormField
                                            control={form.control}
                                            name={`fields.${index}.name`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs">Name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="fieldName" {...field} className="h-8 text-sm" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`fields.${index}.label`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs">Label</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Field Label" {...field} className="h-8 text-sm" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <FormField
                                            control={form.control}
                                            name={`fields.${index}.type`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs">Type</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className="h-8 text-sm">
                                                                <SelectValue placeholder="Select type" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {FIELD_TYPES.map((type) => (
                                                                <SelectItem key={type.value} value={type.value}>
                                                                    {type.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`fields.${index}.required`}
                                            render={({ field }) => (
                                                <FormItem className="flex items-center gap-2 pt-6">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                    <FormLabel className="text-xs font-normal">Required</FormLabel>
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {form.watch(`fields.${index}.type`) === "select" && (
                                        <FormField
                                            control={form.control}
                                            name={`fields.${index}.options`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs">Options (comma-separated)</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="option1, option2, option3"
                                                            value={(field.value || []).join(", ")}
                                                            onChange={(e) => {
                                                                const options = e.target.value
                                                                    .split(",")
                                                                    .map((s) => s.trim())
                                                                    .filter(Boolean);
                                                                field.onChange(options);
                                                            }}
                                                            className="h-8 text-sm"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Saving..." : isEditMode ? "Save Changes" : "Create Collection"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
