"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
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
import { useToast } from "../ui/use-toast"
import { addNUSModsURLToCookies } from "@/lib/courseActions"
import { updateUserTimetableColors } from "@/lib/generalActions"


const formSchema = z.object({
    name: z.string(),
    link: z.string().min(1, 'Required').url('Invalid link'),
});

const LinkAdder = () => {
    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
        }
    })

    const { setError } = form;

    async function onSubmit(values: z.infer<typeof formSchema>) : Promise<void> {
        try {
            await addNUSModsURLToCookies({
                name: values.name,
                url: values.link,
                isFriend: false,
            });
            await updateUserTimetableColors(values.link);
        }
        catch (error) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "There was a problem with your request."
            })
            setError('link', { type: "other", message: "Oops, something went wrong! Try again later." });
            console.error(error)
        }
    }


    return (
        <div>
            <div className="text-black font-sans text-[24px]/[36px] font-[600] tracking-[-.24px] my-4 sm:mx-[80px]">Manual Link Input</div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-row items-end gap-[12px] sm:mx-[80px]">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Enter your friend's name:</FormLabel>
                                <FormControl>
                                    <Input className="w-full" placeholder="Name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="link"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Enter NUSMods Share URL: </FormLabel>
                                <FormControl>
                                    <Input className="w-full" placeholder="NUSMods share URL" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Add URL</Button>
                </form>
            </Form>
        </div>
        
    )
}

export default LinkAdder