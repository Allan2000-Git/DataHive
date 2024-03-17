"use client"
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useOrganization, useUser } from '@clerk/nextjs'
import FileCard from '../../_components/FileCard'
import Image from 'next/image'
import FileUpload from '../../_components/FileUpload'
import DashboardSkeleton from '../../_components/DashboardSkeleton'
import SearchBar from '../../_components/SearchBar'
import { useState } from 'react'

function Files() {
    const [query, setQuery] = useState("");

    const organization = useOrganization();
    const user = useUser();
    let orgId: string | undefined = undefined;
    if (organization.isLoaded && user.isLoaded) {
        orgId = organization.organization?.id ?? user.user?.id;
    }

    const files = useQuery(api.files.getAllFiles, orgId  ? {orgId, query} : "skip");

    const isLoading = files === undefined;

    return (
        <>
            <div className="flex w-full justify-between gap-[40px]">
                <div className="flex-1">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold">Your Files</h1>
                        <SearchBar query={query} setQuery={setQuery} />
                        <FileUpload />
                    </div>
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
                        <h1 className="text-2xl font-bold">No files yet. Please upload one</h1>
                        <FileUpload />
                    </div>
                }
                {
                    files && files?.length > 0 && 
                    <div className="mt-7 grid lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-1 gap-5 w-full">
                        {
                            files?.map((file) => (
                                <FileCard key={file._id} file={file} />
                            ))
                        }
                    </div>
                }
                </div>
            </div>
        </>
    )
}

export default Files