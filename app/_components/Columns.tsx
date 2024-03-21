"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { api } from "@/convex/_generated/api"
import { Doc } from "@/convex/_generated/dataModel"
import { formatDate } from "@/lib/formatDate"
import { ColumnDef } from "@tanstack/react-table"
import { useQuery } from "convex/react"
import FileActions from "./FileActions"

export const columns: ColumnDef<Doc<"files"> & {isFavorite: boolean}>[] = [
    {
        accessorKey: "fileName",
        header: "Name",
    },
    {
        accessorKey: "fileType",
        header: "File Type",
    },
    {
        header: "Uploaded by",
        cell: ({ row }) => {
            const user = useQuery(api.users.getUserDetails, {userId: row.original.userId});
            return <div className="flex items-center gap-1">
                        <Avatar className="w-6 h-6">
                            <AvatarImage src={user?.image} />
                            <AvatarFallback>{user?.name}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{user?.name}</span>
                    </div>
        },
    },
    {
        header: "Uploaded on",
        cell: ({ row }) => {
            return <div className="font-medium">{formatDate(row.original._creationTime)}</div>
        },
    },
    {
        header: "Actions",
        cell: ({ row }) => {
            return <FileActions isFavorite={row.original.isFavorite} file={row.original} />
        },
    },
]
