"use client"

import { useState } from "react";
import { Button } from "../ui/button";
import { unsendFriendRequest } from "@/lib/friendsActions";
import { LuCheck } from "react-icons/lu";
import { Spinner } from "../ui/spinner";
import { useRouter } from "next/navigation";

type UnsendFriendRequestButtonProps = {
    recipientId: string;
}

const UnsendFriendRequestButton: React.FC<UnsendFriendRequestButtonProps> = ( { recipientId }: UnsendFriendRequestButtonProps ) => {
    const [unsending, setUnsending] = useState("");
    const router = useRouter();

    return (
        <form action={async () => {
            setUnsending("unsending");
            try {
                await unsendFriendRequest(recipientId);
                setUnsending("unsent");
                setTimeout(() => {
                    router.refresh();
                }, 1500)
            } catch (error) {
                console.error(`Error Unsending Request, ${error}`);
            }
        }}>
            <Button variant={unsending === "unsent" ? "success" : "destructive"} type="submit">
                {unsending === "unsent" 
                ? (<div className="flex flex-row items-center">
                    <div>Unsent</div>
                    <LuCheck className="ml-1" />
                </div>) 
                : unsending === "unsending"
                ? (<div className="flex flex-row">
                    <Spinner/>
                    <div>Unsending...</div>
                </div>)
                : "Unsend Request"}
            </Button>
        </form>
    )
}

export default UnsendFriendRequestButton;