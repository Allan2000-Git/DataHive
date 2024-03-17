import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { Dispatch, SetStateAction } from 'react'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { SearchIcon } from 'lucide-react'
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';

interface ISearchBarProps {
    query: string;
    setQuery: Dispatch<SetStateAction<string>>;
}

const formSchema = z.object({
    query: z.string().min(0).max(200),
})

function SearchBar({query, setQuery}: ISearchBarProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            query: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setQuery(values.query);
    }

    return (
        <>
            <Form {...form}>
                <form 
                onSubmit={form.handleSubmit(onSubmit)} 
                className="flex items-center border rounded-lg p-1 overflow-hidden">
                    <FormField
                    control={form.control}
                    name="query"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                            <Input
                            className="focus-visible:ring-white outline-none border-none w-[300px] text-black" 
                            placeholder="Search for files..."
                            {...field}
                            />
                            </FormControl>
                        </FormItem>
                    )}
                    />
                    <Button> <SearchIcon size={20} /> </Button>
                </form>
            </Form>
        </>
    )
}

export default SearchBar
