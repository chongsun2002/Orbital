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
            <Button type="submit" className="rounded-3xl bg-red-600 hover:bg-red-400">
                Log Out
            </Button>
        </form>
    )
}

export default LogoutButton;