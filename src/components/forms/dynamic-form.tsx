"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { buildDynamicSchema } from "@/lib/validations";
import type { CollectionField, DynamicDocument } from "@/types/firestore-schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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

interface DynamicFormProps {
    fields: CollectionField[];
    initialData?: DynamicDocument;
    onSubmit: (data: DynamicDocument) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

export function DynamicForm({ fields, initialData, onSubmit, onCancel, isLoading }: DynamicFormProps) {
    const isEditMode = !!initialData;
    const schema = buildDynamicSchema(fields);

    const defaultValues: Record<string, unknown> = { id: "" };
    for (const field of fields) {
        if (field.type === "boolean") {
            defaultValues[field.name] = false;
        } else if (field.type === "number") {
            defaultValues[field.name] = 0;
        } else {
            defaultValues[field.name] = "";
        }
    }

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: initialData || defaultValues,
    });

    const handleSubmit = async (data: Record<string, unknown>) => {
        await onSubmit(data as DynamicDocument);
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
                                <FormLabel>ID</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="document-id"
                                        {...field}
                                        disabled={isEditMode}
                                        className={cn(isEditMode && "bg-muted")}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {fields.map((fieldDef) => (
                        <FormField
                            key={fieldDef.name}
                            control={form.control}
                            name={fieldDef.name}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        {fieldDef.label}
                                        {fieldDef.required && <span className="text-destructive ml-1">*</span>}
                                    </FormLabel>
                                    <FormControl>
                                        {fieldDef.type === "textarea" ? (
                                            <Textarea
                                                placeholder={fieldDef.placeholder || `Enter ${fieldDef.label.toLowerCase()}`}
                                                {...field}
                                                value={field.value as string || ""}
                                            />
                                        ) : fieldDef.type === "select" && fieldDef.options ? (
                                            <Select onValueChange={field.onChange} defaultValue={field.value as string}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder={`Select ${fieldDef.label.toLowerCase()}`} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {fieldDef.options.map((option) => (
                                                        <SelectItem key={option} value={option}>
                                                            {option}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        ) : fieldDef.type === "boolean" ? (
                                            <Switch
                                                checked={field.value as boolean}
                                                onCheckedChange={field.onChange}
                                            />
                                        ) : fieldDef.type === "number" ? (
                                            <Input
                                                type="number"
                                                placeholder={fieldDef.placeholder || "0"}
                                                {...field}
                                                value={field.value as number || ""}
                                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                            />
                                        ) : (
                                            <Input
                                                type={fieldDef.type === "url" ? "url" : "text"}
                                                placeholder={fieldDef.placeholder || `Enter ${fieldDef.label.toLowerCase()}`}
                                                {...field}
                                                value={field.value as string || ""}
                                            />
                                        )}
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    ))}
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Saving..." : isEditMode ? "Save Changes" : "Create"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
