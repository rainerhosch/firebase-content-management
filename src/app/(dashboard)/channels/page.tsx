"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Channel } from "@/types/firestore-schema";
import { ChannelFormData } from "@/lib/validations";
import { getChannels, createChannel, updateChannel, deleteChannel } from "@/lib/firestore-actions";
import { PageHeader } from "@/components/layout/page-header";
import { DataTable } from "@/components/tables/data-table";
import { getChannelColumns } from "@/components/tables/channels-columns";
import { ChannelForm } from "@/components/forms/channel-form";
import { DeleteDialog } from "@/components/dialogs/delete-dialog";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Plus, RefreshCw } from "lucide-react";

export default function ChannelsPage() {
    const [channels, setChannels] = useState<Channel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const fetchChannels = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getChannels();
            setChannels(data);
        } catch (error) {
            console.error("Failed to fetch channels:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchChannels();
    }, [fetchChannels]);

    const handleCreate = () => {
        setSelectedChannel(null);
        setIsFormOpen(true);
    };

    const handleEdit = (channel: Channel) => {
        setSelectedChannel(channel);
        setIsFormOpen(true);
    };

    const handleDelete = (channel: Channel) => {
        setSelectedChannel(channel);
        setIsDeleteOpen(true);
    };

    const handleFormSubmit = async (data: ChannelFormData) => {
        setIsSaving(true);
        try {
            if (selectedChannel) {
                await updateChannel(selectedChannel.id, data);
            } else {
                await createChannel(data as Channel);
            }
            setIsFormOpen(false);
            setSelectedChannel(null);
            await fetchChannels();
        } catch (error) {
            console.error("Failed to save channel:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!selectedChannel) return;
        setIsSaving(true);
        try {
            await deleteChannel(selectedChannel.id);
            setIsDeleteOpen(false);
            setSelectedChannel(null);
            await fetchChannels();
        } catch (error) {
            console.error("Failed to delete channel:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const columns = useMemo(
        () => getChannelColumns({ onEdit: handleEdit, onDelete: handleDelete }),
        []
    );

    return (
        <div className="space-y-6">
            <PageHeader
                title="Channels"
                description="Manage TV channels and their streaming sources."
            >
                <Button variant="outline" size="sm" onClick={fetchChannels} disabled={isLoading}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                    Refresh
                </Button>
                <Button onClick={handleCreate}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Channel
                </Button>
            </PageHeader>

            <DataTable
                columns={columns}
                data={channels}
                searchKey="name"
                searchPlaceholder="Search channels..."
            />

            <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
                <SheetContent className="sm:max-w-lg overflow-y-auto px-6">
                    <SheetHeader className="px-0">
                        <SheetTitle>
                            {selectedChannel ? "Edit Channel" : "Add Channel"}
                        </SheetTitle>
                    </SheetHeader>
                    <div className="mt-6 pb-6">
                        <ChannelForm
                            initialData={selectedChannel || undefined}
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
                title="Delete Channel"
                description={`Are you sure you want to delete "${selectedChannel?.name}"? This action cannot be undone.`}
                isLoading={isSaving}
            />
        </div>
    );
}
