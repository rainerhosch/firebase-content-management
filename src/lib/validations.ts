import { z } from "zod";
import type { CollectionField } from "@/types/firestore-schema";

/**
 * Zod validation schemas for Firestore collections
 */

/**
 * Collection field schema
 */
export const collectionFieldSchema = z.object({
    name: z.string().min(1, "Field name is required").regex(/^[a-zA-Z][a-zA-Z0-9]*$/, "Field name must start with a letter"),
    label: z.string().min(1, "Label is required"),
    type: z.enum(["text", "url", "textarea", "select", "number", "boolean"]),
    required: z.boolean().default(false),
    options: z.array(z.string()).optional(),
    placeholder: z.string().optional(),
});

/**
 * Stream schema - validates streaming source objects
 */
export const streamSchema = z.object({
    name: z.string().min(1, "Stream name is required"),
    url: z.string().url("Invalid URL format"),
    description: z.string().default(""),
});

/**
 * Channel schema - validates TV channel entries
 */
export const channelSchema = z.object({
    id: z.string().min(1, "ID is required").regex(/^[a-z0-9-]+$/, "ID must be lowercase alphanumeric with hyphens only"),
    name: z.string().min(1, "Name is required"),
    category: z.string().min(1, "Category is required"),
    logo: z.string().url("Invalid logo URL"),
    streams: z.array(streamSchema).min(1, "At least one stream is required"),
});

/**
 * Dracin schema - validates Asian drama source entries
 */
export const dracinSchema = z.object({
    id: z.string().min(1, "ID is required").regex(/^[a-z0-9-]+$/, "ID must be lowercase alphanumeric with hyphens only"),
    name: z.string().min(1, "Name is required"),
    image: z.string().url("Invalid image URL"),
    description: z.string().default(""),
    status: z.enum(["aktif", "nonaktif"]),
});

/**
 * Collection config schema - validates menu/collection configuration
 */
export const collectionConfigSchema = z.object({
    id: z.string().min(1, "ID is required").regex(/^[a-z0-9-]+$/, "ID must be lowercase alphanumeric with hyphens only"),
    name: z.string().min(1, "Name is required"),
    icon: z.string().min(1, "Icon is required"),
    route: z.string().min(1, "Route is required").startsWith("/", "Route must start with /"),
    order: z.number().int().min(0, "Order must be positive"),
    enabled: z.boolean().default(true),
    fields: z.array(collectionFieldSchema).default([]),
    isSystem: z.boolean().optional(),
});

/**
 * Role permission schema - validates role-based access control
 */
export const rolePermissionSchema = z.object({
    id: z.string().min(1, "ID is required").regex(/^[a-z0-9-]+$/, "ID must be lowercase alphanumeric with hyphens only"),
    name: z.string().min(1, "Name is required"),
    description: z.string().default(""),
    allowedCollections: z.array(z.string()).min(1, "At least one collection must be allowed"),
});

/**
 * User schema - validates user accounts
 */
export const userSchema = z.object({
    id: z.string().min(1, "ID is required").regex(/^[a-z0-9-]+$/, "ID must be lowercase alphanumeric with hyphens only"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    displayName: z.string().min(1, "Display name is required"),
    role: z.string().min(1, "Role is required"),
});

/**
 * User edit schema - password optional for updates
 */
export const userEditSchema = userSchema.extend({
    password: z.string().min(6, "Password must be at least 6 characters").optional().or(z.literal("")),
});

/**
 * Build dynamic schema from collection fields
 */
export function buildDynamicSchema(fields: CollectionField[]) {
    const shape: Record<string, z.ZodTypeAny> = {
        id: z.string().min(1, "ID is required").regex(/^[a-z0-9-]+$/, "ID must be lowercase alphanumeric with hyphens only"),
    };

    for (const field of fields) {
        let fieldSchema: z.ZodTypeAny;

        switch (field.type) {
            case "text":
                fieldSchema = z.string();
                break;
            case "url":
                fieldSchema = z.string().url("Invalid URL format");
                break;
            case "textarea":
                fieldSchema = z.string();
                break;
            case "number":
                fieldSchema = z.coerce.number();
                break;
            case "boolean":
                fieldSchema = z.boolean();
                break;
            case "select":
                if (field.options && field.options.length > 0) {
                    fieldSchema = z.enum(field.options as [string, ...string[]]);
                } else {
                    fieldSchema = z.string();
                }
                break;
            default:
                fieldSchema = z.string();
        }

        if (field.required) {
            if (field.type === "text" || field.type === "url" || field.type === "textarea") {
                fieldSchema = (fieldSchema as z.ZodString).min(1, `${field.label} is required`);
            }
        } else {
            fieldSchema = fieldSchema.optional();
        }

        shape[field.name] = fieldSchema;
    }

    return z.object(shape);
}

/**
 * Inferred types from schemas
 */
export type StreamFormData = z.infer<typeof streamSchema>;
export type ChannelFormData = z.infer<typeof channelSchema>;
export type DracinFormData = z.infer<typeof dracinSchema>;
export type CollectionConfigFormData = z.infer<typeof collectionConfigSchema>;
export type CollectionFieldFormData = z.infer<typeof collectionFieldSchema>;
export type RolePermissionFormData = z.infer<typeof rolePermissionSchema>;
export type UserFormData = z.infer<typeof userSchema>;
export type UserEditFormData = z.infer<typeof userEditSchema>;
