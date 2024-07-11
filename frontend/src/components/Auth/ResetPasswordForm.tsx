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
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import React from 'react'
import { resetPassword } from "@/lib/authActions"
import { cookies } from "next/headers"

const formSchema = z.object({
    password: z.string().min(1, 'Required').min(8, 'Password must have at least 8 characters'),
    verifyPassword: z.string().min(1, 'Required')
}).refine(schema => schema.password == schema.verifyPassword, { message: 'Passwords do not match', path: ['verifyPassword'] })

const ResetPasswordForm: React.FC = () => {
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: '',
            verifyPassword: ''
        }
    })

    const { setError } = form;

    async function onSubmit(values: z.infer<typeof formSchema>) : Promise<void> {
        try {
            const responseCode: number = await resetPassword(values.password);
            switch(responseCode) {
                case 401:
                    setError('password', { type: "401", message: "You are not authorized to make this password reset." });
                    break;
                case 200:
                    router.push('/login');
                    // router.refresh(); Test the robustness of redirecting to home. If the login button does not get refreshed, call this.
                    break;
                default:
                    setError('password', { type: "500", message: "Oops, something went wrong! Try again later." });
            }
        } catch (error) {
            const formError = { type: "other", message: "Oops, something went wrong! Try again later." }
            setError('password', formError)
            console.error(error)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col w-full items-center gap-[12px]">
                <div className="text-black font-sans text-center text-[24px]/[36px] font-[600] tracking-[-.24px] mb-10">Reset Password</div>
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                                <Input type="password" className="w-full" placeholder="Enter a new password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="verifyPassword"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel>Confirm New Password</FormLabel>
                            <FormControl>
                                <Input type="password" className="w-full" placeholder="Confirm new password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full">Reset Password</Button>
            </form>
        </Form>
    )
}

export default ResetPasswordForm