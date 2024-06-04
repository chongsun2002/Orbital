import { Button } from "../ui/button";
import { endSession } from "@/lib/session";
import { useRouter } from "next/navigation"
import { redirect } from "next/navigation";

const LogoutButton = () => {
    return (
        <form action={async () => {
            'use server'
            await endSession();
            redirect("/success");
        }}>
            <Button type="submit" variant="destructive" className="rounded-3xl">
                Log Out
            </Button>
        </form>
    )
}

export default LogoutButton;