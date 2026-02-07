"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Channel, Stream } from "@/types/firestore-schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2, ExternalLink } from "lucide-react";
import Image from "next/image";

interface ChannelColumnsProps {
    onEdit: (channel: Channel) => void;
    onDelete: (channel: Channel) => void;
}

export function getChannelColumns({ onEdit, onDelete }: ChannelColumnsProps): ColumnDef<Channel>[] {
    return [
        {
            accessorKey: "logo",
            header: "Logo",
            cell: ({ row }) => {
                const logo = row.getValue("logo") as string;
                return (
                    <div className="relative h-10 w-10 overflow-hidden rounded-md border bg-muted">
                        {logo ? (
                            <Image
                                src={logo}
                                alt={row.original.name}
                                fill
                                className="object-cover"
                                unoptimized
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                                N/A
                            </div>
                        )}
                    </div>
                );
            },
        },
        {
            accessorKey: "name",
            header: "Name",
            cell: ({ row }) => (
                <span className="font-medium">{row.getValue("name")}</span>
            ),
        },
        {
            accessorKey: "id",
            header: "ID",
            cell: ({ row }) => (
                <code className="text-xs bg-muted px-2 py-1 rounded">{row.getValue("id")}</code>
            ),
        },
        {
            accessorKey: "category",
            header: "Category",
            cell: ({ row }) => (
                <Badge variant="secondary">{row.getValue("category")}</Badge>
            ),
        },
        {
            accessorKey: "streams",
            header: "Streams",
            cell: ({ row }) => {
                const streams = row.getValue("streams") as Stream[];
                const count = streams?.length || 0;

                if (count === 0) {
                    return <span className="text-muted-foreground">No streams</span>;
                }

                return (
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-auto py-1 px-2">
                                <Badge variant="outline">{count} Streams</Badge>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80" align="start">
                            <div className="space-y-3">
                                <h4 className="font-medium text-sm">Stream Sources</h4>
                                <div className="space-y-2 max-h-48 overflow-y-auto">
                                    {streams.map((stream, index) => (
                                        <div key={index} className="text-sm border rounded-lg p-2">
                                            <div className="font-medium">{stream.name}</div>
                                            {stream.description && (
                                                <div className="text-muted-foreground text-xs">
                                                    {stream.description}
                                                </div>
                                            )}
                                            <a
                                                href={stream.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs text-primary hover:underline flex items-center gap-1 mt-1"
                                            >
                                                <ExternalLink className="h-3 w-3" />
                                                Open URL
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                );
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const channel = row.original;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onEdit(channel)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => onDelete(channel)}
                                className="text-destructive focus:text-destructive"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];
}
