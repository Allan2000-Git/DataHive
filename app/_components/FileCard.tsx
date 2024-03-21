"use client"

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Doc } from "@/convex/_generated/dataModel"
import { FileTextIcon, ImageIcon,SheetIcon} from "lucide-react"
import { ReactNode } from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import Image from "next/image";
import { getFileImage } from "@/lib/fileUrl"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDate } from '@/lib/formatDate';
import FileActions from "./FileActions"

const iconTypes= {
    image: <ImageIcon size={18} />,
    csv: <SheetIcon size={18} />,
    pdf:  <FileTextIcon size={18} />
} as Record<Doc<"files">["fileType"], ReactNode>;

function FileCard({file} : {file: Doc<"files"> & {isFavorite: boolean}}) {

    const user = useQuery(api.users.getUserDetails, {userId: file.userId});

    return (
        <Card className="flex flex-col justify-between gap-3">
            <div>
                <CardHeader>
                    <div className="flex items-center gap-3 justify-between">
                        <CardTitle className="text-[16px] flex items-center justify-between gap-3">
                            {iconTypes[file.fileType]}
                            {file.fileName}
                        </CardTitle>
                        <FileActions isFavorite={file.isFavorite} file={file} />
                    </div>
                </CardHeader>
                <CardContent className="w-full flex justify-center">
                    {
                        file.fileType === "image" && 
                        <Image 
                        className="object-cover w-full h-full"
                        src={getFileImage(file.fileId)}
                        alt={file.fileName}
                        width={300}
                        height={80}
                        />
                    }
                    {
                        file.fileType === "csv" && 
                        <Image 
                        className="object-cover"
                        src="/csv-placeholder.png"
                        alt={file.fileName}
                        width={200}
                        height={200}
                        />
                    }
                    {
                        file.fileType === "pdf" && 
                        <Image 
                        className="object-cover"
                        src="/pdf-placeholder.png"
                        alt={file.fileName}
                        width={200}
                        height={200}
                        />
                    }
                </CardContent>
            </div>
            <CardFooter className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                    <Avatar className="w-6 h-6">
                        <AvatarImage src={user?.image} />
                        <AvatarFallback>{user?.name}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{user?.name}</span>
                </div>
                <span className="text-sm text-gray-500">{formatDate(file._creationTime)}</span>
            </CardFooter>
        </Card>
    )
}

export default FileCard
