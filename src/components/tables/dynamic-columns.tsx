"use client";

import { ColumnDef } from "@tanstack/react-table";
import type { CollectionField, DynamicDocument } from "@/types/firestore-schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

interface DynamicColumnsProps {
    fields: CollectionField[];
    onEdit: (doc: DynamicDocument) => void;
    onDelete: (doc: DynamicDocument) => void;
}

export function getDynamicColumns({ fields, onEdit, onDelete }: DynamicColumnsProps): ColumnDef<DynamicDocument>[] {
    const columns: ColumnDef<DynamicDocument>[] = [
        {
            accessorKey: "id",
            header: "ID",
            cell: ({ row }) => (
                <code className="text-xs bg-muted px-2 py-1 rounded">{row.getValue("id")}</code>
            ),
        },
    ];

    // Add columns for each field (limit to first 4 for table view)
    const displayFields = fields.slice(0, 4);

    for (const field of displayFields) {
        columns.push({
            accessorKey: field.name,
            header: field.label,
            cell: ({ row }) => {
                const value = row.getValue(field.name);

                if (value === undefined || value === null || value === "") {
                    return <span className="text-muted-foreground">-</span>;
                }

                if (field.type === "boolean") {
                    return (
                        <Badge variant={value ? "default" : "secondary"}>
                            {value ? "Yes" : "No"}
                        </Badge>
                    );
                }

                if (field.type === "select") {
                    return <Badge variant="outline">{String(value)}</Badge>;
                }

                if (field.type === "url") {
                    return (
                        <a
                            href={String(value)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm truncate max-w-[150px] block"
                        >
                            {String(value)}
                        </a>
                    );
                }

                if (field.type === "textarea") {
                    return (
                        <span className="text-sm max-w-[200px] truncate block">
                            {String(value)}
                        </span>
                    );
                }

                return <span className="text-sm">{String(value)}</span>;
            },
        });
    }

    // Add actions column
    columns.push({
        id: "actions",
        cell: ({ row }) => {
            const document = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(document)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => onDelete(document)}
                            className="text-destructive focus:text-destructive"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    });

    return columns;
}
