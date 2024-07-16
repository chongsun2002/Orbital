"use client"

import { removeFriend } from "@/lib/friendsActions";
import { useState } from "react";
import { Button } from "../ui/button";
import { LuCheck } from "react-icons/lu";
import { Spinner } from "../ui/spinner";
import { useRouter } from "next/navigation";
import { deleteNUSModsURL } from "@/lib/courseActions";

type RemoveFriendButtonProps = {
    friendId: string;
    friendName: string;
}

const RemoveFriendButton: React.FC<RemoveFriendButtonProps> = ( { friendId, friendName }: RemoveFriendButtonProps) => {
    const [removing, setRemoving] = useState("");
    const router = useRouter();

    return (
        <form action={async () => {
            setRemoving("removing");
            try {
                await removeFriend(friendId);
                await deleteNUSModsURL(friendName);
                setRemoving("removed");
                setTimeout(() => {
                    router.refresh();
                }, 1500)
            } catch (error) {
                console.error(`Error Removing Friend, ${error}`);
                setRemoving("");
            }
        }}>
            <Button variant={removing === "removed" ? "success" : "destructive"} type="submit">
                {removing === "removed" 
                ? (<div className="flex flex-row items-center">
                    <div>Removed!</div>
                    <LuCheck className="ml-1" />
                </div>) 
                : removing === "removing"
                ? (<div className="flex flex-row">
                    <Spinner/>
                    <div>Removing...</div>
                </div>)
                : "Remove Friend"}
            </Button>
        </form>
    )
}

export default RemoveFriendButton;