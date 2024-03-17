"use client"
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useOrganization, useUser } from '@clerk/nextjs'
import FileCard from '../_components/FileCard'
import Image from 'next/image'
import FileUpload from '../_components/FileUpload'
import { Skeleton } from '@/components/ui/skeleton'
import DashboardSkeleton from '../_components/DashboardSkeleton'

function Dashboard() {

    const organization = useOrganization();
    const user = useUser();
    let orgId: string | undefined = undefined;
    if (organization.isLoaded && user.isLoaded) {
        orgId = organization.organization?.id ?? user.user?.id;
    }

    const files = useQuery(api.files.getAllFiles, orgId  ? {orgId} : "skip");

    const isLoading = files === undefined;

    return (
        <>
            <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex justify-between gap-[40px]">
                    {
                        isLoading ? (
                            <DashboardSkeleton />
                        ) : files ? (
                            <>
                            <div className="flex-1">
                                <div className="flex justify-between">
                                    <h1 className="text-3xl font-bold">Your Files</h1>  
                                    <FileUpload />
                                </div>
                                <div className="mt-7 grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-1 gap-5">
                                    {
                                        files?.map((file) => (
                                            <FileCard key={file._id} file={file} />
                                        ))
                                    }
                                </div>
                            </div>
                            </>
                        ):(
                            <div className="w-full h-full flex flex-col justify-center items-center py-14 gap-10">
                                <Image 
                                src="/empty-state.svg"
                                alt="Empty State - No files"
                                width={600}
                                height={600}
                                />
                                <h1 className="text-2xl font-bold">No files yet. Please upload one</h1>
                                <FileUpload />
                            </div>
                        )
                    }
                </div>
            </div>
        </>
    )
}

export default Dashboard
