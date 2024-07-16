import { deleteNUSModsURL } from "@/lib/courseActions";
import { redirect } from "next/navigation";
import { Button } from "../ui/button";
import { LuTrash2 } from "react-icons/lu";
import { cn } from "@/lib/utils";

type DeleteTimetableUserButtonProps = {
    name: string;
    className?: string;
}

const DeleteTimetableUserButton: React.FC<DeleteTimetableUserButtonProps> = ({ name, className }: DeleteTimetableUserButtonProps) => {
    return (
        <form action={async () => {
            "use server"
            await deleteNUSModsURL(name);
            redirect("/course_matching");
        }}>
            <Button variant="destructive" className={cn("h-6 w-auto px-1 py-1 ml-5 flex items-center justify-center rounded-l-none rounded-r-full", className)}>
                <LuTrash2 className="w-6 h-4" />
            </Button>
        </form>
    )
}

export default DeleteTimetableUserButton;