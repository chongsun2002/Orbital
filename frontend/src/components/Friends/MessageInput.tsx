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
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "../ui/use-toast"
import { sendMessage } from "@/lib/userActions"
import React from "react"


const formSchema = z.object({
    message: z.string().min(1, 'Required'),
});

type MessageInputProps = {
    receipientId: string;
}

const MessageInput: React.FC<MessageInputProps> = ({ receipientId }: MessageInputProps) => {
    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    })

    const { setError } = form;

    async function onSubmit(values: z.infer<typeof formSchema>) : Promise<void> {
        try {
            await sendMessage(receipientId, values.message);
            toast({
                variant: "success",
                title: "Sent!",
                description: "The message was successfully sent!"
            })
        }
        catch (error) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "There was a problem with your request."
            })
            setError('message', { type: "other", message: "Oops, something went wrong! Try again later." });
            console.error(error)
        }
    }


    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-row items-end gap-[12px]">
                    <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Enter Message: </FormLabel>
                                <FormControl>
                                    <Textarea className="w-full" placeholder="Message..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Send Message</Button>
                </form>
            </Form>
        </div>
        
    )
}

export default MessageInput;