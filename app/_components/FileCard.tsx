"use client"
import  moment from 'moment';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Doc, Id } from "@/convex/_generated/dataModel"
import { ArchiveRestoreIcon, DownloadIcon, EllipsisVertical, FileTextIcon, ImageIcon,SheetIcon, SparklesIcon, StarIcon, TrashIcon } from "lucide-react"
import { ReactNode, useState } from "react"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { toast } from "sonner";
import Image from "next/image";
import { getFileImage, getFileUrl } from "@/lib/fileUrl"
import { Protect } from "@clerk/nextjs"
import { ConvexError } from "convex/values"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const iconTypes= {
    image: <ImageIcon size={18} />,
    csv: <SheetIcon size={18} />,
    pdf:  <FileTextIcon size={18} />
} as Record<Doc<"files">["fileType"], ReactNode>;

function FileCard({file, favorites} : {file: Doc<"files">, favorites: Doc<"favorites">[] | undefined}) {
    const [isAlertOpen, setIsAlertOpen] = useState(false);

    const deleteFile = useMutation(api.files.deleteFile);
    const restoreFile = useMutation(api.files.restoreFile);
    const toggleFavorite = useMutation(api.files.toggleFavorite);

    const user = useQuery(api.users.getUserDetails, {userId: file.userId});

    const handleFileDelete = async () => {
        try {
            await deleteFile({ fileId: file._id });
            toast.success(`File ${file.fileName} has been marked to be deleted.`);
        } catch (error) {
            if (error instanceof ConvexError) {
                toast.error((error.data as { message: string }).message);
            } else {
                toast.error("An error occurred while deleting the file.");
            }
        }        
    }

    const handleFileRestore = async () => {
        try {
            await restoreFile({ fileId: file._id });
            toast.success(`File ${file.fileName} has been restored`);
        } catch (error) {
            if (error instanceof ConvexError) {
                toast.error((error.data as { message: string }).message);
            } else {
                toast.error("An error occurred while deleting the file.");
            }
        }        
    } 

    const handleToggleFavorite = () => {
        toggleFavorite({
            fileId: file._id
        });
        toast(`${isFavorite ? "Removed" : "Added"} to favorites.`);
    }

    const isFavorite = favorites?.some((favorite) => favorite.fileId === file._id);

    // Assuming file._creationTime is a timestamp or a Date object
    const creationTime = moment(file._creationTime);
    const now = moment();

    let displayTime;
    if (now.diff(creationTime, 'days') >= 1) {
        // If the difference is more than or equal to 1 day, display the date
        displayTime = creationTime.format('MMMM Do YYYY');
    } else {
        // Otherwise, display relative time
        displayTime = creationTime.fromNow();
    }

    return (
        <Card className="flex flex-col justify-between gap-3">
            <div>
                <CardHeader>
                    <div className="flex items-center gap-3 justify-between">
                        <CardTitle className="text-[16px] flex items-center justify-between gap-3">
                            {iconTypes[file.fileType]}
                            {file.fileName}
                        </CardTitle>
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <EllipsisVertical size={20} />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem
                                onClick={handleToggleFavorite}
                                className="flex items-center gap-3 text-yellow-600 cursor-pointer"
                                >
                                    {
                                        isFavorite ? <SparklesIcon size={16} />  : <StarIcon size={16} />
                                    }
                                    {
                                        isFavorite ? "Unfavorite" : "Favorite"
                                    }
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                onClick={() =>{
                                    if(file.toBeDeleted){
                                        handleFileRestore();
                                    }else{
                                        setIsAlertOpen(true);
                                    }
                                }}
                                >
                                    {
                                        !file.toBeDeleted ?
                                        <>
                                            <div className="flex items-center gap-3 text-red-600 cursor-pointer">
                                                <TrashIcon size={16} /> 
                                                Delete
                                            </div>
                                        </>
                                        :
                                        <>
                                            <div className="flex items-center gap-3 text-green-600 cursor-pointer">
                                                <ArchiveRestoreIcon size={16} /> 
                                                Restore
                                            </div>
                                        </>
                                    }
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                onClick={() => window.open(getFileUrl(file.fileId), '_blank')}
                                className="flex items-center gap-3 cursor-pointer"
                                >
                                    <DownloadIcon size={16} /> Download
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    File deletion isn't instant. It takes a few days, during which you can still restore your data.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleFileDelete}>Continue</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
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
                <span className="text-sm text-gray-500">{displayTime}</span>
            </CardFooter>
        </Card>
    )
}

export default FileCard
