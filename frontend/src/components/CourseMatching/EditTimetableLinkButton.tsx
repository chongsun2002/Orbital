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
import { LuCheck, LuPencil } from "react-icons/lu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { editNUSModsURL } from "@/lib/courseActions"
import { updateUserDetails, updateUserTimetableColors } from "@/lib/generalActions"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Spinner } from "../ui/spinner"



type EditTimetableUserButtonProps = {
    name: string;
    isCurrentUser: boolean; // Is the person whose' url being edited the current user? if so, do a permanent edit.
    className?: string;
}

const formSchema = z.object({
    link: z.string().min(1, 'Required').url('Invalid link'),
});

const EditTimetableUserButton: React.FC<EditTimetableUserButtonProps> = ({ name, isCurrentUser, className }: EditTimetableUserButtonProps) => {
    const { toast } = useToast();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState("");

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    })

    const { setError } = form;

    const currUserSubmit = async (values: z.infer<typeof formSchema>) : Promise<void> => {
        setEditing("editing");
        try {
            await updateUserTimetableColors(values.link);
            await editNUSModsURL(name, values.link);
            await updateUserDetails({name: name, timetableUrl: values.link});
            setEditing("edited")
            setTimeout(() => {
                setOpen(false);
            }, 1500)
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "There was a problem with your request."
            })
            setError('link', { type: "other", message: "Oops, something went wrong! Try again later." });
            setEditing("");
            console.error(error);
        }
    }

    const otherUserSubmit = async (values: z.infer<typeof formSchema>) : Promise<void> => {
        setEditing("editing");
        try {
            await editNUSModsURL(name, values.link);
            await updateUserTimetableColors(values.link);
            setEditing("edited")
            setTimeout(() => {
                setOpen(false);
            }, 1500)
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "There was a problem with your request."
            })
            setError('link', { type: "other", message: "Oops, something went wrong! Try again later." });
            setEditing("");
            console.error(error)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className={cn("h-6 w-auto px-1 py-1 ml-5 flex items-center justify-center rounded-l-none rounded-r-full text-primary-foreground bg-primary", className)}>
                <LuPencil className="w-6 h-4" />
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit NUSModsLink</DialogTitle>
                    <DialogDescription>
                        {isCurrentUser ? "Doing this will permanently change your profile's NUSMods URL!" 
                            : "Doing this will permanently change the NUSMods URL you have added!"}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit((isCurrentUser ? currUserSubmit : otherUserSubmit))} className="flex flex-row items-end gap-[12px]">
                        <FormField
                            control={form.control}
                            name="link"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Enter new NUSMods Share URL: </FormLabel>
                                    <FormControl>
                                        <Input className="w-full" placeholder="NUSMods share URL" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button variant={editing === "edited" ? "success" : "default"} type="submit">
                            {editing === "edited" 
                            ? (<div className="flex flex-row items-center">
                                <div>Edited!</div>
                                <LuCheck className="ml-1" />
                            </div>) 
                            : editing === "edited"
                            ? (<div className="flex flex-row">
                                <Spinner />
                                <div>Editing...</div>
                            </div>)
                            : "Edit URL"}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default EditTimetableUserButton;