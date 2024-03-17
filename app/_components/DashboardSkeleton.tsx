import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

function DashboardSkeleton() {
    return (
        <div className="flex-1">
            {/* <div className="flex justify-between">
                <Skeleton className="h-10 w-[250px]" />
                <Skeleton className="h-10 w-[250px]" />
            </div> */}
            <div className="mt-7 grid lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-1 gap-5">
                {
                    [1,2,3].map((index) => (
                        <Skeleton key={index} className="h-[350px] w-[280px]" />
                    ))
                }
            </div>
        </div>
    )
}

export default DashboardSkeleton
