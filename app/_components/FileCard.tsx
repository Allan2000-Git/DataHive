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
import { EllipsisVertical, FileTextIcon, ImageIcon,SheetIcon, TrashIcon } from "lucide-react"
import { ReactNode, useState } from "react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { toast } from "sonner";
import Image from "next/image";
import { getFileUrl } from "@/lib/fileUrl"

const iconTypes= {
    image: <ImageIcon />,
    csv: <SheetIcon />,
    pdf:  <FileTextIcon />
} as Record<Doc<"files">["fileType"], ReactNode>;

function FileCard({file} : {file: Doc<"files">}) {
    const [isAlertOpen, setIsAlertOpen] = useState(false);

    const deleteFile = useMutation(api.files.deleteFile);

    const handleFileDelete = () => {
        deleteFile({
            fileId: file._id
        });
        toast.success(`File ${file.fileName} deleted successfully.`);
    }

    return (
        <Card className="flex flex-col justify-between">
            <div>
                <CardHeader>
                    <div className="flex items-center gap-3 justify-between">
                        <CardTitle className="text-lg flex items-center justify-between gap-3">
                            {iconTypes[file.fileType]}
                            {file.fileName}
                        </CardTitle>
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <EllipsisVertical />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
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
                        src={getFileUrl(file.fileId)}
                        alt={file.fileName}
                        width={100}
                        height={100}
                        />
                    }
                    {
                        file.fileType === "csv" && 
                        <Image 
                        src="/csv-placeholder.png"
                        alt={file.fileName}
                        width={200}
                        height={200}
                        />
                    }
                    {
                        file.fileType === "pdf" && 
                        <Image 
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
