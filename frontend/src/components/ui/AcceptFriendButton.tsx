"use client"

import { useState } from "react"
import { Button } from "./button"
import { acceptFriendRequest } from "@/lib/friendsActions"
import { useToast } from "./use-toast"

const AcceptFriendButton = ({id}: {id: string}) => {
    const [success, setSuccess] = useState(false);
    const { toast } = useToast();

    async function onClick() {
        try {
            await acceptFriendRequest(id);
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
                   : <Button type='button' onClick={onClick}>Accept</Button>
}

export default AcceptFriendButton;