import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

function DashboardSkeleton() {
    return (
        <div className="flex-1">
            <div className="flex justify-between">
                <Skeleton className="h-10 w-[250px]" />
                <Skeleton className="h-10 w-[250px]" />
            </div>
            <div className="mt-7 grid lg:grid-cols-4 md:grid-cols-4 sm:grid-cols-1 gap-5">
                {
                    [1,2,3,4].map(() => (
                        <Skeleton className="h-[350px] w-[350px]" />
                    ))
                }
            </div>
        </div>
    )
}

export default DashboardSkeleton
