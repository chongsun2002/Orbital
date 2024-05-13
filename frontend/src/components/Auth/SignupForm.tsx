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

const formSchema = z.object({
    email: z.string().min(1)
})

const SignupForm = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: ""
        }
    })

    return (
        <Form {...form}>
            <form className="flex flex-col w-full items-center gap-[12px]">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-black font-sans text-center">
                                <div className="text-[24px]/[36px] font-[600] tracking-[-.24px]">Create an account</div>
                                <div className="text-[16px]/[24px] font-[400]">Enter your email to sign up for this app</div>
                            </FormLabel>
                            <FormControl>
                                <Input className="w-full" placeholder="example@gmail.com" {...field} />
                            </FormControl>
                            <FormDescription />
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full">Sign up with email</Button>
            </form>
        </Form>
    )
}

export default SignupForm