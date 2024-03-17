import { FileIcon, StarIcon, TrashIcon } from "lucide-react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "DataHive Dashboard | Centralized File Storage Management",
    description: "Manage and organize your files efficiently with the DataHive Dashboard. Access, organize, and secure your data all in one place.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex gap-7">
                <div className="w-1/5 flex flex-col gap-4 p-2">
                    {
                        links.map(link => (
                            <Link href={link.url} key={link.id} className="flex items-center gap-3 p-2 rounded-lg text-primary_main bg-tertiary_main/10">
                                {link.icon}
                                {link.name}
                            </Link>
                        ))
                    }
                </div>
                {children}
            </div>
        </div>
    );
}

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