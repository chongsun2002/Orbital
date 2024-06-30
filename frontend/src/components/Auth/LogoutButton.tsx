import { Button } from "../ui/button";
import { endSession } from "@/lib/session";
import { useRouter } from "next/navigation"
import { redirect } from "next/navigation";

const LogoutButton = () => {
    const router = useRouter();

    return (
        <form action={async () => {
            await endSession();
            router.push("/success");
        }}>
            <Button type="submit" variant="destructive" className="w-full">
                Log Out
            </Button>
        </form>
    )
}

export default LogoutButton;