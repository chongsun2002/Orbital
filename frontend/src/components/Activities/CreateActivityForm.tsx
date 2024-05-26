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
import { createActivity } from "@/lib/activityActions"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Textarea } from "../ui/textarea"
import dynamic from 'next/dynamic'
// import { Calendar } from "../ui/calendar"
const Calendar = dynamic(() => import("../ui/calendar").then(mod => mod.Calendar), {
    loading: () => <p>Loading...</p>
}); // Using dynamic import to make initial render faster.

const formSchema = z.object({
    title: z.string().min(1, 'Required'),
    description: z.string().optional(),
    date: z.object({
        from: z.date(),
        to: z.date()
    }),
    startTime: z.string(),
    endTime: z.string(),
    numOfParticipants: z.coerce.number({
        required_error: "Required",
        invalid_type_error: "Must be a positive number"
    }).int().positive("Must be a positive number")
}).refine(schema => {
    const startDateTime = schema.date.from;
    startDateTime.setHours(Number(schema.startTime.split(':')[0]))
    startDateTime.setMinutes(Number(schema.startTime.split(':')[1]))

    const endDateTime = schema.date.to;
    endDateTime.setHours(Number(schema.endTime.split(':')[0]))
    endDateTime.setMinutes(Number(schema.endTime.split(':')[1]))
    return startDateTime < endDateTime
}, { message: 'The start time must be before the end time', path: ['startTime'] })

const CreateActivityForm = () => {
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            description: '',
            startTime: '',
            endTime: '',

            /** To prevent changing an uncontrolled input to be controlled  */
            numOfParticipants: ''
        }
    })

    const { setError } = form;

    async function onSubmit(values: z.infer<typeof formSchema>) : Promise<void> {
        try {
            const response: { activityId: string } = await createActivity(values);
            const id = response.activityId
            router.push('/activities/' + id)
        } catch (error) {
            const formError = { type: "other", message: "Oops, something went wrong! Try again later." }
            setError('numOfParticipants', formError)
            console.error(error)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col w-full items-center gap-[12px]">
                <div className="text-black font-sans text-center text-[24px]/[36px] font-[600] tracking-[-.24px]">Create an Activity</div>
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
                                <Textarea className="w-full" placeholder="Description of the activity (optional)" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name='date'
                    render={({ field }) => (
                        <FormItem className="flex flex-col w-full">
                            <FormLabel>Event Duration</FormLabel>
                            <FormControl>
                                <Popover>
                                    <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                        )}>
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {field.value?.from ? (
                                        field.value.to ? (
                                            <>
                                            {format(field.value.from, "LLL dd, y")} -{" "}
                                            {format(field.value.to, "LLL dd, y")}
                                            </>
                                        ) : (
                                            format(field.value.from, "LLL dd, y")
                                        )
                                        ) : (
                                        <span>Pick a date</span>
                                        )}
                                    </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        initialFocus
                                        mode="range"
                                        defaultMonth={field.value?.from}
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        numberOfMonths={2}
                                    />
                                    </PopoverContent>
                                </Popover>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                                           )}
                />

                <div className='flex flex-row w-full gap-[20px]'>
                    <FormField
                        control={form.control}
                        name="startTime"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Starting Time</FormLabel>
                                <FormControl>
                                    <Input aria-label='time' type='time' className="w-full" placeholder="Starting Time" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="endTime"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Ending Time</FormLabel>
                                <FormControl>
                                    <Input aria-label='time' type='time' className="w-full" placeholder="Ending Time" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
    
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