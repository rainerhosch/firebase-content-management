"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { channelSchema, ChannelFormData } from "@/lib/validations";
import { Channel } from "@/types/firestore-schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChannelFormProps {
    initialData?: Channel;
    onSubmit: (data: ChannelFormData) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

export function ChannelForm({ initialData, onSubmit, onCancel, isLoading }: ChannelFormProps) {
    const form = useForm<ChannelFormData>({
        resolver: zodResolver(channelSchema),
        defaultValues: initialData || {
            id: "",
            name: "",
            category: "",
            logo: "",
            streams: [{ name: "", url: "", description: "" }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "streams",
    });

    const handleSubmit = async (data: ChannelFormData) => {
        await onSubmit(data);
    };

    const isEditMode = !!initialData;

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <ScrollArea className="h-[calc(100vh-220px)] pr-4">
                    <div className="space-y-6 pb-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>ID</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="channel-id"
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
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Channel Name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category</FormLabel>
                                        <FormControl>
                                            <Input placeholder="movies, sports, news..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="logo"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Logo URL</FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://example.com/logo.png" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <FormLabel className="text-base">Streams</FormLabel>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => append({ name: "", url: "", description: "" })}
                                >
                                    <Plus className="h-4 w-4 mr-1" />
                                    Add Stream
                                </Button>
                            </div>

                            {form.formState.errors.streams?.message && (
                                <p className="text-sm text-destructive">
                                    {form.formState.errors.streams.message}
                                </p>
                            )}

                            <div className="space-y-3">
                                {fields.map((field, index) => (
                                    <div
                                        key={field.id}
                                        className="relative border rounded-lg p-4 bg-muted/30"
                                    >
                                        <div className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground">
                                            <GripVertical className="h-4 w-4" />
                                        </div>
                                        <div className="ml-4 space-y-3">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1 grid grid-cols-2 gap-3">
                                                    <FormField
                                                        control={form.control}
                                                        name={`streams.${index}.name`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel className="text-xs">Stream Name</FormLabel>
                                                                <FormControl>
                                                                    <Input placeholder="Server 1" {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name={`streams.${index}.description`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel className="text-xs">Description</FormLabel>
                                                                <FormControl>
                                                                    <Input placeholder="CDN Main" {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="mt-6 text-muted-foreground hover:text-destructive"
                                                    onClick={() => remove(index)}
                                                    disabled={fields.length === 1}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <FormField
                                                control={form.control}
                                                name={`streams.${index}.url`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-xs">Stream URL</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="https://stream.example.com/stream.m3u8" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </ScrollArea>

                <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Saving..." : isEditMode ? "Save Changes" : "Create Channel"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
