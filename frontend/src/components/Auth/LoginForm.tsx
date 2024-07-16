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
import { login } from "../../lib/authActions"
import { useRouter } from "next/navigation"
import { useToast } from "../ui/use-toast"

const formSchema = z.object({
    email: z.string().min(1, 'Required').email('Invalid email'),
    password: z.string().min(1, 'Required').min(8, 'Password must have at least 8 characters'),
})

const LoginForm = () => {
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    })

    const { setError } = form;
    const { toast } = useToast();

    async function onSubmit(values: z.infer<typeof formSchema>) : Promise<void> {
        try {
            const responseCode: number = await login(values);
            switch(responseCode) {
                case 401:
                    setError('password', { type: "401", message: "Incorrect email or password." });
                    break;
                case 200:
                    router.push('/');
                    // router.refresh(); Test the robustness of redirecting to home. If the login button does not get refreshed, call this.
                    break;
                case 503:
                    setError('password', { type: '503', message: `Email isn't registered with an account.`});
                    toast({
                        title: 'Email not registered',
                        description: `You've signed in with this email previously using Google. Either sign in using Google again or click
                                     the Forgot Password button to set a password for this email.`
                    }) 
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
                                <Input type="password" className="w-full" placeholder="Your password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full">Sign in with email</Button>
            </form>
            <Divider message='or continue with' />
            <GoogleButton />
            <div className='text-[#828282] text-center font-sans text-[16px]/[24px] font-[400] mt-[20px]'>
                If you don&apos;t have an account, 
                <Link href='/signup' className='text-black'> sign up here.</Link>
            </div>
        </Form>
    )
}

export default LoginForm