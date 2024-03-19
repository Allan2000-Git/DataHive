"use client"
import { Button } from "@/components/ui/button"
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
import { Doc } from "@/convex/_generated/dataModel"
import { EllipsisVertical, FileTextIcon, ImageIcon,SheetIcon, StarIcon, TrashIcon } from "lucide-react"
import { ReactNode, useState } from "react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { toast } from "sonner";
import Image from "next/image";
import { getFileUrl } from "@/lib/fileUrl"

const iconTypes= {
    image: <ImageIcon size={18} />,
    csv: <SheetIcon size={18} />,
    pdf:  <FileTextIcon size={18} />
} as Record<Doc<"files">["fileType"], ReactNode>;

function FileCard({file} : {file: Doc<"files">}) {
    const [isAlertOpen, setIsAlertOpen] = useState(false);

    const deleteFile = useMutation(api.files.deleteFile);
    const toggleFavorite = useMutation(api.files.toggleFavorite);

    const handleFileDelete = () => {
        deleteFile({
            fileId: file._id
        });
        toast.success(`File ${file.fileName} deleted successfully.`);
    }

    const handleToggleFavorite = () => {
        toggleFavorite({
            fileId: file._id
        });
        toast(`Added to favorites.`);
    }

    return (
        <Card className="flex flex-col justify-between">
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
                                    <StarIcon size={16} /> 
                                    Favorite
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                onClick={() => setIsAlertOpen(true)}
                                className="flex items-center gap-3 text-red-600 cursor-pointer"
                                >
                                    <TrashIcon size={16} /> 
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your account
                                    and remove your data from our servers.
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
                        className="object-cover"
                        src={getFileUrl(file.fileId)}
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
            <CardFooter>
                <Button>Download</Button>
            </CardFooter>
        </Card>
    )
}

export default FileCard
