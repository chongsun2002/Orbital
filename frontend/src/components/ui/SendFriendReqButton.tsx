"use client"

import { Button } from "./button"
import { sendFriendRequest } from "@/lib/friendsActions"
import { useToast } from "./use-toast"
import { useRouter } from "next/navigation"
import { LuCheck } from "react-icons/lu"
import { Spinner } from "./spinner"
import { Dispatch, SetStateAction } from "react"

type SendFriendRequestButtonProps = {
    className? : string;
    id: string;
    isSecret: boolean;
    sending: string;
    setSending: Dispatch<SetStateAction<string>>;
}

const SendFriendRequestButton = ({className, id, isSecret, sending, setSending}: SendFriendRequestButtonProps) => {
    const { toast } = useToast();
    const router = useRouter();

    async function onSubmit() {
        setSending(isSecret ? "sendingSecret" : "sending");
        try {
            await sendFriendRequest(id, isSecret);
            setSending(isSecret ? "sentSecret" : "sent");
            setTimeout(() => {
                router.refresh();
            }, 1500)
        } catch (error) {
            console.error((error as Error).message);
            return toast({
                title: "Uh oh! Something went wrong.",
                description: `Error sending friend request ${(error as Error).message}`
            });
        }
    }

    return (
        <form action={onSubmit}>
            <Button 
                variant={(isSecret && sending === "sentSecret") || (!isSecret && sending === "sent") ? "success" : "default"}
                type="submit"
                disabled={sending==="sending" || sending==="sendingSecret"}>
                {(isSecret && sending === "sentSecret") || (!isSecret && sending === "sent")
                ? (<div className="flex flex-row items-center">
                    <div>Sent!</div>
                    <LuCheck className="ml-1" />
                </div>) 
                : (isSecret && sending === "sendingSecret") || (!isSecret && sending === "sending")
                ? (<div className="flex flex-row">
                    <Spinner/>
                    <div>Sending...</div>
                </div>)
                : (
                    isSecret ? "Send Anonymous Friend Request"
                        : "Send Friend Request"
                )}
            </Button>
        </form>
    )
}

export default SendFriendRequestButton;