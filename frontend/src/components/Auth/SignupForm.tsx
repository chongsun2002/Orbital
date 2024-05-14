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
import Divider from "../ui/divider"
import GoogleButton from "../ui/googleButton"

const formSchema = z.object({
    email: z.string().min(1, 'Required').email('Invalid email'),
    name: z.string().min(1, "Required"),
    password: z.string().min(1, 'Required').min(8, 'Password must have at least 8 characters'),
    verifyPassword: z.string().min(1, 'Required')
})

const SignupForm = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    })
    
    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
    }

    return (

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col w-full items-center gap-[12px]">
                <div className="text-black font-sans text-center text-[24px]/[36px] font-[600] tracking-[-.24px]">Create an account</div>
                <div className="text-black font-sans text-center text-[16px]/[24px] font-[400]">Enter your email to sign up for this app</div>
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input type='email' className="w-full" placeholder="example@gmail.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input className="w-full" placeholder="Your name" {...field} />
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
                <FormField
                    control={form.control}
                    name="verifyPassword"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel>Verify password</FormLabel>
                            <FormControl>
                                <Input className="w-full" placeholder="Re-enter password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full">Sign up with email</Button>
            </form>
            <Divider message='or continue with' />
            <GoogleButton />
            <div className='text-[#828282] text-center font-sans text-[16px]/[24px] font-[400]'>By clicking continue, you agree to our 
                <a href='' className='text-black'> Terms of Service</a> and 
                <a href='' className='text-black'> Privacy Policy</a>
            </div>
        </Form>
    )
}

export default SignupForm