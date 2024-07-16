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
import { forgetPassword } from "@/lib/authActions"

const formSchema = z.object({
    email: z.string().min(1, 'Required').email('Invalid email'),
})


const ForgotPasswordForm: React.FC = () => {
    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: ''
        }
    })

    const { setError } = form;

    async function onSubmit(values: z.infer<typeof formSchema>) : Promise<void> {
        try {
            const responseCode: number = await forgetPassword(values.email); //await login(values);
            switch(responseCode) {
                case 404:
                    setError('email', { type: "404", message: "The account associated to the email could not be found." });
                    break;
                case 200:
                    toast({
                        variant: "success",
                        title: "Success!",
                        description: "The password reset link has been sent to your email!",
                    })
                    break;
                default:
                    toast({
                        variant: "destructive",
                        title: "Uh oh! Something went wrong.",
                        description: "There was a problem with your request."
                    })
                    setError('email', { type: "500", message: "Oops, something went wrong! Try again later." });
            }
        } catch (error) {
            const formError = { type: "other", message: "Oops, something went wrong! Try again later." }
            setError('email', formError)
            console.error(error)
        }
    }


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col w-full items-center gap-[12px]">
                <div className="text-black font-sans text-center text-[24px]/[36px] font-[600] tracking-[-.24px] mb-10">Forget Password</div>
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel>Enter the email you used to create your account:</FormLabel>
                            <FormControl>
                                <Input className="w-full" placeholder="Your email" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full">Send Reset Password Link</Button>
            </form>
        </Form>
    )
}

export default ForgotPasswordForm;