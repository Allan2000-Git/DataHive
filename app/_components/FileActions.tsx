import React, { useState } from 'react'
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
} from "@/components/ui/alert-dialog"
import { ArchiveRestoreIcon, DownloadIcon, EllipsisVertical, SparklesIcon, StarIcon, TrashIcon } from "lucide-react"
import { toast } from "sonner";
import { Protect, useUser } from "@clerk/nextjs"
import { ConvexError } from "convex/values"
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Doc } from "@/convex/_generated/dataModel"
import { getFileImage } from '@/lib/fileUrl';

function FileActions({isFavorite, file}:{isFavorite: boolean | undefined, file: Doc<"files">}) {
    const [isAlertOpen, setIsAlertOpen] = useState(false);

    const {user} = useUser();

    const deleteFile = useMutation(api.files.deleteFile);
    const restoreFile = useMutation(api.files.restoreFile);
    const toggleFavorite = useMutation(api.files.toggleFavorite);

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

    return (
        <>
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
                    <Protect
                    condition={(check) => {
                        return(
                            check({
                                role: "org:admin",
                            }) ||
                            user?.id === file.userId
                        )
                    }}
                    fallback={<></>}
                    >
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
                    </Protect>
                    <DropdownMenuItem
                    onClick={() => window.open(getFileImage(file.fileId), '_blank')}
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
        </>
    )
}

export default FileActions
