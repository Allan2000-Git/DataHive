"use client"

import React from 'react'
import { FileIcon, StarIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const links = [
    {
        id: 1,
        name:"Files",
        url: "/dashboard/files",
        icon: <FileIcon size={18} />
    },
    {
        id: 2,
        name:"Favorites",
        url: "/dashboard/favorites",
        icon: <StarIcon size={18} />
    },
    {
        id: 3,
        name:"Trash",
        url: "/dashboard/trash",
        icon: <TrashIcon size={18} />
    }
]

function SideNav() {
    const pathname = usePathname();

    return (
        <div className="w-1/5 flex flex-col gap-4 p-2">
            {
                links.map(link => (
                    <Link 
                    href={link.url} 
                    key={link.id} 
                    className={clsx("flex items-center gap-3 p-2", {
                        "text-primary_main bg-tertiary_main/15 rounded-md": pathname === link.url
                    })}
                    >
                        {link.icon}
                        {link.name}
                    </Link>
                ))
            }
        </div>
    )
}

export default SideNav
