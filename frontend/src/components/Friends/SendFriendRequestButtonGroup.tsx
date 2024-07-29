import { useState } from "react";
import SendFriendRequestButton from "../ui/SendFriendReqButton";
import SendMessage from "./SendMessage";

type SendFriendRequestButtonGroupProps = {
    className?: string;
    id: string;
}

const SendFriendRequestButtonGroup: React.FC<SendFriendRequestButtonGroupProps> = ({className, id}: SendFriendRequestButtonGroupProps) => {
    const [sending, setSending] = useState("");
    
    return (
        <div className="flex flex-row gap-5">
            <SendFriendRequestButton className="font-sans text-xl" id={id} isSecret={false} sending={sending} setSending={setSending}/>
            <SendFriendRequestButton className="font-sans text-xl" id={id} isSecret={true} sending={sending} setSending={setSending}/>
            <SendMessage receipientId={id}/>
        </div>
    )
}

export default SendFriendRequestButtonGroup;