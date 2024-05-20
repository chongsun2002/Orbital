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
import { login } from "../../lib/authActions"
import { useRouter } from "next/navigation"
import { createActivity } from "@/lib/activityActions"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Calendar } from "../ui/calendar"
import { CalendarIcon } from "lucide-react"

const formSchema = z.object({
    title: z.string().min(1, 'Required'),
    description: z.string().optional(),
    date: z.date(),
    numOfParticipants: z.coerce.number({
        required_error: "Required"
    }).int().positive("Must be a positive number")
})

const CreateActivityForm = () => {
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            description: '',
            startTime: undefined,
            endTime: undefined,
            numOfParticipants: 0
        }
    })

    const { setError } = form;

    async function onSubmit(values: z.infer<typeof formSchema>) : Promise<void> {
        try {
            const response: Response = await createActivity(values);
            const responseBody: { activityId: string } = await response.json();
            const id: string = responseBody.activityId;
            const responseCode: number = response.status;
            switch(responseCode) {
                case 200:
                    router.push('/activities/' + { id });
                    // router.refresh(); Test the robustness of redirecting to home. If the login button does not get refreshed, call this.
                    break;
                default:
                    setError('numOfParticipants', { type: "500", message: "Oops, something went wrong! Try again later." });
            }
        } catch (error) {
            const formError = { type: "other", message: "Oops, something went wrong! Try again later." }
            setError('numOfParticipants', formError)
            console.error(error)
        }
        console.log(values)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col w-full items-center gap-[12px]">
                <div className="text-black font-sans text-center text-[24px]/[36px] font-[600] tracking-[-.24px]">Create your own Activity</div>
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input className="w-full" placeholder="Title of your activity" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Input className="w-full" placeholder="Description of the activity (optional)" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                        <FormLabel>Date of birth</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-[240px] pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date > new Date() || date < new Date("1900-01-01")
                                }
                                initialFocus
                              />
                             </PopoverContent>
                               </Popover> 
                             <FormMessage />
                         </FormItem>
                    )}
                    /> 
                <FormField
                    control={form.control}
                    name="numOfParticipants"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel>Number of Participants</FormLabel>
                            <FormControl>
                                <Input className="w-full" placeholder="Maximum number of participants" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full">Create Activity!</Button>
            </form>
        </Form>
    )
}

export default CreateActivityForm