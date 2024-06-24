"use client"

import { useState } from "react"
import { Button } from "./button"
import { sendFriendRequest } from "@/lib/friendsActions"
import { useToast } from "./use-toast"

const SendFriendRequestButton = ({className, id, isSecret}: {className?: string, id: string, isSecret: boolean}) => {
    const [success, setSuccess] = useState(false);
    const { toast } = useToast();

    async function onClick() {
        try {
            await sendFriendRequest(id, isSecret);
            setSuccess(true);
        } catch (error) {
            console.error((error as Error).message);
            return toast({
                title: "Uh oh! Something went wrong.",
                description: (error as Error).message
            });
        }
    }

    return success ? <div>success!</div>
                   : <Button className={className} type='button' onClick={onClick}>
                        {isSecret ? "Send Anonymous Friend Request" : "Send Friend Request"}
                    </Button>
}

export default SendFriendRequestButton;