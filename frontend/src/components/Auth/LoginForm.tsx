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
import Link from "next/link"
import Divider from "../ui/divider"
import GoogleButton from "./googleButton"
import { login, User } from "../../lib/authActions"
import { redirectHome } from "../../lib/generalActions"

const formSchema = z.object({
    email: z.string().min(1, 'Required').email('Invalid email'),
    password: z.string().min(1, 'Required').min(8, 'Password must have at least 8 characters'),
})

const LoginForm = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const user: User = await login(values);
        localStorage.setItem('userData', JSON.stringify(user));
        redirectHome();
    }

    return (

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col w-full items-center gap-[12px]">
                <div className="text-black font-sans text-center text-[24px]/[36px] font-[600] tracking-[-.24px]">Login with your email</div>
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input className="w-full" placeholder="Your email" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input className="w-full" placeholder="Your password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full">Sign in with email</Button>
            </form>
            <Divider message='or continue with' />
            <GoogleButton />
            <div className='text-[#828282] text-center font-sans text-[16px]/[24px] font-[400]'>
                If you don&apos;t have an account, 
                <Link href='/signup' className='text-black'> sign up here.</Link>
            </div>
        </Form>
    )
}

export default LoginForm