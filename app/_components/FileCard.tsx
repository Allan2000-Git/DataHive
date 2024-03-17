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
import { EllipsisVertical, TrashIcon } from "lucide-react"
import { useState } from "react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { toast } from "sonner";

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
        <Card>
            <CardHeader>
                <div className="flex items-center gap-3 justify-between">
                    <CardTitle>{file.fileName}</CardTitle>
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
            <CardContent>
                <p>Card Content</p>
            </CardContent>
            <CardFooter>
                <Button>Download</Button>
            </CardFooter>
        </Card>
    )
}

export default FileCard
