"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Dracin } from "@/types/firestore-schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

interface DracinColumnsProps {
    onEdit: (dracin: Dracin) => void;
    onDelete: (dracin: Dracin) => void;
}

export function getDracinColumns({ onEdit, onDelete }: DracinColumnsProps): ColumnDef<Dracin>[] {
    return [
        {
            accessorKey: "image",
            header: "Image",
            cell: ({ row }) => {
                const image = row.getValue("image") as string;
                const name = row.original.name;

                return (
                    <Avatar className="h-10 w-10 rounded-md">
                        <AvatarImage src={image} alt={name} className="object-cover" />
                        <AvatarFallback className="rounded-md text-xs">
                            {name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
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
            accessorKey: "description",
            header: "Description",
            cell: ({ row }) => {
                const description = row.getValue("description") as string;
                if (!description) {
                    return <span className="text-muted-foreground text-sm">-</span>;
                }
                return (
                    <span className="text-sm max-w-[200px] truncate block">
                        {description}
                    </span>
                );
            },
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.getValue("status") as string;
                const isActive = status === "aktif";

                return (
                    <Badge
                        variant={isActive ? "default" : "secondary"}
                        className={isActive ? "bg-green-600 hover:bg-green-700" : ""}
                    >
                        {isActive ? "Active" : "Inactive"}
                    </Badge>
                );
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const dracin = row.original;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onEdit(dracin)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => onDelete(dracin)}
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
