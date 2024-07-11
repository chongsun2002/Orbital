"use client"

import { useState } from "react"
import { Button } from "./button"
import { acceptFriendRequest } from "@/lib/friendsActions"
import { useToast } from "./use-toast"
import { LuCheck } from "react-icons/lu"
import { Spinner } from "./spinner"

const AcceptFriendButton = ({id}: {id: string}) => {
    const [accepting, setAccepting] = useState("");
    const { toast } = useToast();

    return (
        <form action={async () => {
            setAccepting("accepting")
            try {
                await acceptFriendRequest(id);
                setAccepting("accepted");
            } catch (error) {
                console.error((error as Error).message);
                setAccepting("accept");
                return toast({
                    title: "Uh oh! Something went wrong.",
                    description: (error as Error).message
                });
            }
        }}>
            <Button variant={accepting === "accepted" ? "success" : "default"} type="submit">
                {accepting === "accepted" 
                ? (<div className="flex flex-row items-center">
                    <div>Accepted!</div>
                    <LuCheck className="ml-1" />
                </div>) 
                : accepting === "accepting"
                ? (<div className="flex flex-row">
                    <Spinner/>
                    <div>Accepting...</div>
                </div>)
                : "Accept"}
            </Button>
        </form>
    )
}

export default AcceptFriendButton;