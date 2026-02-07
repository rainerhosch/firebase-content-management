"use client";

import { ColumnDef } from "@tanstack/react-table";
import { User } from "@/types/firestore-schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

interface UserColumnsProps {
    onEdit: (user: User) => void;
    onDelete: (user: User) => void;
}

export function getUserColumns({ onEdit, onDelete }: UserColumnsProps): ColumnDef<User>[] {
    return [
        {
            accessorKey: "displayName",
            header: "Name",
            cell: ({ row }) => (
                <span className="font-medium">{row.getValue("displayName")}</span>
            ),
        },
        {
            accessorKey: "email",
            header: "Email",
            cell: ({ row }) => (
                <span className="text-sm">{row.getValue("email")}</span>
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
            accessorKey: "role",
            header: "Role",
            cell: ({ row }) => {
                const role = row.getValue("role") as string;
                const isAdmin = role === "admin";
                const isEditor = role === "editor";

                return (
                    <Badge
                        variant={isAdmin ? "default" : isEditor ? "secondary" : "outline"}
                        className={isAdmin ? "bg-blue-600 hover:bg-blue-700" : ""}
                    >
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                    </Badge>
                );
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const user = row.original;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onEdit(user)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => onDelete(user)}
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
