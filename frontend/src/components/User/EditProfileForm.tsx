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

const formSchema = z.object({
    name: z.string().min(1, 'Required'),
    bio: z.string().optional(),
    birthday: z.string().date().optional()
});

interface FormProps {
    name: string,
    bio?: string,
    birthday?: string
}

const EditProfileForm = ({name, bio, birthday}: FormProps) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: name,
            bio: bio ?? '',
            birthday: birthday?.substring(0,10) ?? ''
        }
    })

    const { setError } = form;

    async function onSubmit(values: z.infer<typeof formSchema>) : Promise<void> {
        await updateUserDetails({
            name: values.name,
            bio: values.bio,
            birthday: new Date(values.birthday ?? '')
        });        
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
                <Button type="submit" className="w-full">Save changes</Button>
            </form>
        </Form>
    )
}

export default EditProfileForm;