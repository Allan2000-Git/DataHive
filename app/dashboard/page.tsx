"use client"
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useOrganization, useUser } from '@clerk/nextjs'
import { useState } from 'react'
import { toast } from "sonner";
import { LoaderCircle } from 'lucide-react'

// https://medium.com/@damien_16960/input-file-x-shadcn-x-zod-88f0472c2b81

const formSchema = z.object({
    title: z.string().min(3,  {
        message: "Title must be at least 3 characters.",
    }).max(200),
    file:  z
            .custom<FileList>((file) => file instanceof FileList, "File is required.")
            .refine((file) => file?.length > 0, "File is required.")
})

function Dashboard() {
    const [isUploadFileModalOpen, setIsUploadFileModalOpen] = useState(false);

    const {organization} = useOrganization();
    const {user} = useUser();
    let orgId: string | undefined = undefined;
    if (organization && user) {
        orgId = organization?.id ?? user?.id;
    }

    const createFile = useMutation(api.files.createFile);
    const generateUploadUrl = useMutation(api.files.generateUploadUrl);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            file: undefined,
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)

        if(!orgId) return;

        const postUrl = await generateUploadUrl();
        const result = await fetch(postUrl, {
            method: "POST",
            headers: { "Content-Type": values.file[0].type },
            body: values.file[0],
        });
        const { storageId } = await result.json();

        try {
            await createFile({
                fileName: values.title,
                fileId: storageId,
                orgId
            });

            toast.success(`File ${values.title} uploaded successfully`);

            setIsUploadFileModalOpen(false);

            form.reset();
        } catch (error) {
            toast.error(`File could not be uploaded.`);
        }
    }

    const fileRef = form.register("file");

    return (
        <>
            <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-secondary_main">Your Files</h1>
                    </div>
                    <div>
                        <Dialog open={isUploadFileModalOpen} onOpenChange={setIsUploadFileModalOpen}>
                            <DialogTrigger asChild>
                                <Button>Upload a File</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                <DialogTitle className="text-xl font-semibold mb-6">Upload a File</DialogTitle>
                                <DialogDescription>
                                    <Form {...form}>
                                        <form 
                                        onSubmit={form.handleSubmit(onSubmit)} 
                                        className="space-y-8">
                                            <FormField
                                            control={form.control}
                                            name="title"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Title</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Add a title" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                            />
                                            <FormField
                                            control={form.control}
                                            name="file"
                                            render={() => (
                                                <FormItem className="mt-3">
                                                    <FormLabel>File</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                        type="file" {...fileRef} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                            />
                                            <Button 
                                            disabled={form.formState.isSubmitting}
                                            className="gap-2"
                                            type="submit">
                                                Submit
                                                {
                                                    form.formState.isSubmitting && <LoaderCircle className="h-4 2-4 animate-spin" />
                                                }
                                            </Button>
                                        </form>
                                    </Form>
                                </DialogDescription>
                                </DialogHeader>
                            </DialogContent>
                        </Dialog>

                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard
