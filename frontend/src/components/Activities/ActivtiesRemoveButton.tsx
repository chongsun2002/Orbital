"use client"
import { LuTrash2 } from "react-icons/lu";
import { LuCheck } from "react-icons/lu";
import { Button } from "../ui/button";
import { deleteActivity } from "@/lib/activityActions";
import { useRouter } from "next/navigation";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { Spinner } from "../ui/spinner";
import { useState } from "react";

const ActivityRemoveButton = ({ id }: { id: string }) => {
    const [open, setOpen] = useState(false);
    const [deleting, setDeleting] = useState("");;
    const router = useRouter();

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="destructive">
                    <LuTrash2/>
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the
                        activity and remove its data from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <form action={async () => {
                        setDeleting("deleting");
                        try {
                            await deleteActivity(id);
                            setDeleting("deleted");
                            setTimeout(() => {
                                setOpen(false);
                                router.push("/activities");
                            }, 1500)
                        } catch (error) {
                            console.error(`Error deleting activity, ${error}`);
                        } 
                    }}>
                        <Button variant={deleting === "deleted" ? "success" : "destructive"} type="submit">
                            {deleting === "deleted" 
                            ? (<div className="flex flex-row items-center">
                                <div>Deleted</div>
                                <LuCheck className="ml-1" />
                            </div>) 
                            : deleting === "deleting"
                            ? (<div className="flex flex-row">
                                <Spinner/>
                                <div>Deleting...</div>
                            </div>)
                            : "Delete Activity"}
                        </Button>
                    </form>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default ActivityRemoveButton;