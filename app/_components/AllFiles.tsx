"use client"

import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useOrganization, useUser } from '@clerk/nextjs'
import FileCard from '../_components/FileCard'
import Image from 'next/image'
import FileUpload from '../_components/FileUpload'
import DashboardSkeleton from '../_components/DashboardSkeleton'
import SearchBar from '../_components/SearchBar'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { DataTable } from './FileTable'
import { columns } from './Columns'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LayoutGridIcon, Table2Icon } from 'lucide-react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

function AllFiles({title, isFavorite, toBeDeleted}:{title: string, isFavorite?: boolean, toBeDeleted?: boolean}) {
    const [query, setQuery] = useState("");
    const [fileTypeQuery, setFileTypeQuery] = useState("all");

    const pathName = usePathname();

    const organization = useOrganization();
    const user = useUser();
    let orgId: string | undefined = undefined;
    if (organization.isLoaded && user.isLoaded) {
        orgId = organization.organization?.id ?? user.user?.id;
    }

    const files = useQuery(api.files.getAllFiles, orgId  ? {orgId, query, isFavorite, toBeDeleted, fileTypeQuery} : "skip");
    const favorites = useQuery(api.files.getAllFavorites, orgId  ? {orgId} : "skip");

    const newFilesAfterFavorite = files?.map(file => ({
        ...file,
        isFavorite: (favorites ?? []).some((favorite) => favorite.fileId === file._id)
    })) ?? [];

    const isLoading = files === undefined;

    return (
        <>
            <div className="flex w-full justify-between gap-[40px]">
                <div className="flex-1">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold">{title}</h1>
                        {
                            !(pathName === "/dashboard/trash") && 
                            <>
                                <SearchBar query={query} setQuery={setQuery} />
                                <FileUpload />
                            </>
                        }
                    </div>
                        <Tabs defaultValue="grid" className="w-full mt-5">
                            <div className="flex items-center justify-between">
                                <TabsList>
                                    <TabsTrigger value="grid">
                                        <div className="flex items-center gap-2 text-sm">
                                            <LayoutGridIcon size={16} />
                                            Grid
                                        </div>
                                    </TabsTrigger>
                                    <TabsTrigger value="table">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Table2Icon size={16} />
                                            Table
                                        </div>
                                    </TabsTrigger>
                                </TabsList>
                                <Select value={fileTypeQuery} onValueChange={setFileTypeQuery}>
                                    <SelectTrigger className="w-[150px]" defaultValue={"all"}>
                                        <SelectValue placeholder="All" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All</SelectItem>
                                        <SelectItem value="image">Image</SelectItem>
                                        <SelectItem value="pdf">PDF</SelectItem>
                                        <SelectItem value="csv">CSV</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <TabsContent value="grid">
                                {
                                    files && files?.length > 0 && 
                                    <div className="mt-5 grid lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-1 gap-5 w-full">
                                        {
                                            newFilesAfterFavorite?.map((file) => (
                                                <FileCard key={file._id} file={{ ...file, isFavorite: file.isFavorite ?? false }} />
                                            ))
                                        }
                                    </div>
                                }
                            </TabsContent>
                            <TabsContent value="table">
                                <div className="mt-5">
                                    <DataTable columns={columns} data={newFilesAfterFavorite ?? []} />
                                </div>
                            </TabsContent>
                        </Tabs>
                    {
                        isLoading && <DashboardSkeleton />
                    }
                    {
                        files?.length === 0 && 
                        <div className="w-full h-full flex flex-1 flex-col justify-center items-center py-14 gap-10">
                            <Image 
                            src="/empty-state.svg"
                            alt="Empty State - No files"
                            width={600}
                            height={600}
                            />
                            <h1 className="text-2xl font-bold">{`${pathName === "/dashboard/trash" ? "No files to be deleted." : "No files yet. Please upload one"}`}</h1>
                            {!(pathName === "/dashboard/trash") &&  <FileUpload />}
                        </div>
                    }
                </div>
            </div>
        </>
    )
}

export default AllFiles