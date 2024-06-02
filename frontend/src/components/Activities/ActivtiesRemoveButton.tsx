import { LuTrash2 } from "react-icons/lu";
import { Button } from "../ui/button";
import { deleteActivity } from "@/lib/activityActions";
import { redirect } from "next/navigation";

const ActivityRemoveButton = ({ id }: { id: string }) => {
    return (
        <form action={async () => {
            "use server"
            await deleteActivity(id);
            redirect("/");
        }}>
            <Button type="submit" className="bg-rose-600">
                <LuTrash2/>
            </Button>
        </form>
    )
}

export default ActivityRemoveButton;