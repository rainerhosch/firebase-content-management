import { z } from "zod";

/**
 * Zod validation schemas for Firestore collections
 */

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
    status: z.enum(["aktif", "nonaktif"], {
        required_error: "Status is required",
    }),
});

/**
 * Inferred types from schemas
 */
export type StreamFormData = z.infer<typeof streamSchema>;
export type ChannelFormData = z.infer<typeof channelSchema>;
export type DracinFormData = z.infer<typeof dracinSchema>;
