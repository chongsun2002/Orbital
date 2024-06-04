"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { LuPencil } from "react-icons/lu";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { format, parseISO } from "date-fns"
import { toZonedTime } from "date-fns-tz"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Textarea } from "../ui/textarea"
import { locationFilters, categoryFilters } from "@/lib/constants/activityConstants"
import { Activity} from "@/lib/types/activityTypes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { Calendar } from "../ui/calendar"
import { editActivity } from "@/lib/activityActions";
import { useState } from "react"
import { Spinner } from "../ui/spinner";
import { LuCheck } from "react-icons/lu";

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
    }).int().positive("Must be a positive number"),
    category: z.string({
        required_error: "Please select a category"
    }),
    location: z.string({
        required_error: "Please select a location"
    })
}).refine(schema => {
    const startDateTime = schema.date.from;
    startDateTime.setHours(Number(schema.startTime.split(':')[0]))
    startDateTime.setMinutes(Number(schema.startTime.split(':')[1]))

    const endDateTime = schema.date.to;
    endDateTime.setHours(Number(schema.endTime.split(':')[0]))
    endDateTime.setMinutes(Number(schema.endTime.split(':')[1]))
    return startDateTime < endDateTime
}, { message: 'The start time must be before the end time', path: ['startTime'] })

const ActivityEditSheet = ({id, title, description, startTime, endTime, numOfParticipants, category, location}: Activity) => {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState("");

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: title ?? '',
            description: description ?? '',
            startTime: format(toZonedTime(startTime, Intl.DateTimeFormat().resolvedOptions().timeZone), "HH:mm"),
            endTime: format(toZonedTime(endTime, Intl.DateTimeFormat().resolvedOptions().timeZone), "HH:mm"),
            date: {
                from: parseISO(startTime),
                to: parseISO(endTime)
            },
            category: category ?? '',
            location: location ?? '',
            numOfParticipants: parseInt(numOfParticipants)
        }
    })

    async function onSubmit(values: z.infer<typeof formSchema>) : Promise<void> {
        setEditing("editing");
        try {
            await editActivity(id, values);
            setEditing("edited");
            await new Promise(resolve => setTimeout(resolve, 1500));
            setOpen(false);
            router.refresh();
        } catch (error) {
            const formError = { type: "other", message: "Oops, something went wrong! Try again later." }
            setError('category', formError)
            console.error(error)
        } finally {
            await new Promise(resolve => setTimeout(resolve, 300));
            setEditing("");
        }
    }

    const { setError } = form;
    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="outline">
                    <div className="flex flex-row items-center">
                        <LuPencil className="mr-1"/>
                        Edit Activity
                    </div>
                </Button>
            </SheetTrigger>
            <SheetContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col justify-center">
                        <SheetHeader>
                            <SheetTitle>

                            </SheetTitle>
                            <SheetDescription>

                            </SheetDescription>
                        </SheetHeader>
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
                                <FormItem className="w-full mt-3">
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
                                <FormItem className="flex flex-col w-full mt-3">
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

                        <div className='flex flex-row w-full gap-[20px] mt-3'>
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
                                <FormItem className="w-full mt-3">
                                    <FormLabel>Number of Participants {"(Default: 4)"}</FormLabel>
                                    <FormControl>
                                        <Input className="w-full" placeholder="Maximum number of participants" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex flex-col w-full gap-3 mt-3">
                            <FormField
                                control={form.control}
                                name="location"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Location</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a location" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {locationFilters.map((location, index) => 
                                                        <SelectItem value={location.value} key={index}>{location.name}</SelectItem>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a category" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {categoryFilters.map((category, index) => 
                                                        <SelectItem value={category.value} key={index}>{category.name}</SelectItem>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Button variant={editing === "edited" ? "success" : "default"} type="submit" className="mt-3">
                            {editing === "edited" 
                            ? (<div className="flex flex-row items-center">
                                <div>Successfully Changed!</div>
                                <LuCheck className="ml-1" />
                            </div>) 
                            : editing === "editing"
                            ? (<div className="flex flex-row">
                                <Spinner/>
                                <div>Editing...</div>
                            </div>)
                            : "Save Changes!"}
                        </Button>
                    </form>
                </Form>
            </SheetContent>
        </Sheet>
    )
}

export default ActivityEditSheet;