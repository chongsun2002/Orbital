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
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Textarea } from "../ui/textarea"
import { updateUserDetails } from "@/lib/generalActions"
import { useToast } from "../ui/use-toast"
import { useState } from "react"
import { Spinner } from "../ui/spinner"

const formSchema = z.object({
    name: z.string().min(1, 'Required'),
    bio: z.string().optional(),
    birthday: z.string().date().optional(),
    timetableUrl: z.string().optional()
});

interface FormProps {
    name: string,
    bio?: string,
    birthday?: string
    timetableUrl?: string
}

const EditProfileForm = ({name, bio, birthday, timetableUrl}: FormProps) => {
    const router = useRouter();
    const { toast } = useToast();
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: name,
            bio: bio ?? '',
            birthday: birthday?.substring(0,10) ?? '',
            timetableUrl: timetableUrl ?? ''
        }
    })

    const { setError } = form;

    const [creating, setCreating] = useState(false);

    async function onSubmit(values: z.infer<typeof formSchema>) : Promise<void> {
        setCreating(true);
        try {
            const response = await updateUserDetails({
                name: values.name,
                bio: values.bio,
                birthday: new Date(values.birthday ?? ''),
                timetableUrl: values.timetableUrl
            });

            toast({
                variant: "success",
                title: "Successfully Saved!",
                description: "You will be redirected home soon.",
            })
            router.push('/')
        } catch (error) {
            const formError = { type: "other", message: "Oops, something went wrong! Try again later." }
            setError('timetableUrl', formError)
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "There was a problem with your request."
            })
            console.error(error)
        } finally {
            setCreating(false);
        }
    }


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col w-full items-center gap-[12px]">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel>Your Name</FormLabel>
                            <FormControl>
                                <Input className="w-full" placeholder="Your display name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel>Bio</FormLabel>
                            <FormControl>
                                <Textarea className="w-full" placeholder="A short description about yourself"{...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name='birthday'
                    render={({ field }) => (
                        <FormItem className="flex flex-col w-full">
                            <FormLabel>Your Birthday</FormLabel>
                            <FormControl>
                                <Input type='date' className="w-full" placeholder='Your birthday' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name='timetableUrl'
                    render={({ field }) => (
                        <FormItem className="flex flex-col w-full">
                            <FormLabel>Link your timetable!</FormLabel>
                            <FormControl>
                                <Input type='url' className="w-full" placeholder='Your NUSMods timetable link' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full">
                    {creating ? (
                        <div className="flex flex-row">
                            <Spinner/>
                            <div>Please Wait...</div>
                        </div>) : "Save Changes"}
                </Button>
            </form>
        </Form>
    )
}

export default EditProfileForm;