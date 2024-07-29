import { Notification } from "@/lib/types/userTypes";
import { mailAssociatedItem, mailNextAction, mailNextLinkHref, notificationTypeToTitle } from "@/lib/userUtils";
import { format } from "date-fns";
import { Dispatch, SetStateAction, useState } from "react"
import React from "react";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
  } from "@/components/ui/collapsible"
import { LuChevronsDown, LuTrash2 } from "react-icons/lu";
import { Button } from "../ui/button";
import Link from "next/link";

type MailboxItemDisplayProps = {
    notification: Notification;
    viewNotification: (notificationId: string) => Promise<any>;
    addToDelete: (notificationId: string) => void;
}

const MailboxItemDisplay: React.FC<MailboxItemDisplayProps> = ({ notification, viewNotification, addToDelete }: MailboxItemDisplayProps) => {
    const [deleted, setDeleted] = useState(false);
    const [isSeen, setIsSeen] = useState(notification.seen);
    if (deleted) {
        return <div></div>;
    }
    const handleOpenToView = (isOpen: boolean) => {
        if (isOpen) {
            setIsSeen(true);
            viewNotification(notification.id);
        }
    }

    const nextActionTitle = mailNextAction(notification.notificationType);
    const nextLink: string = mailNextLinkHref(notification.notificationType, notification.additionalContentId)
    const notificationTitle: string = notificationTypeToTitle(notification.notificationType, notification.associatedItem);
    return (
        <div className="flex flex-row hover:bg-accent p-2 items-center">
                <Collapsible className="w-full" onOpenChange={handleOpenToView}>
                    <CollapsibleTrigger className="w-full">
                        <div className="scroll-m-20 text-base font-semibold tracking-tight">
                            <div className="flex flex-row justify-between">
                                <div className="font-semibold">
                                    {notificationTitle}
                                </div>
                                <div className="flex flex-row items-center gap-2">
                                    {format(notification.createdAt, "d MMMM yy, h:mm a")}
                                    <LuChevronsDown />
                                    {!isSeen
                                        ? <div className="flex flex-row items-center gap-[2px] text-xs font-bold">
                                            <div className="w-3 h-3 bg-blue-700 rounded-full shrink-0" />
                                            New!
                                        </div> 
                                        : <Button variant="destructive" className="h-6 w-auto px-2 py-1 flex items-center justify-center mx-[20px] sm:mx-0" onClick={() =>{
                                            addToDelete(notification.id);
                                            setDeleted(true);
                                        }}>
                                            <div className="flex flex-row items-center">
                                                <LuTrash2 className="w-5 h-4" />
                                            </div>
                                        </Button>}
                                        
                                </div>
                            </div>
                        </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="flex flex-col">
                        {notification.content}
                        <Link href={nextLink} className="hover:underline hover:font-semibold">
                            {"Click to " + nextActionTitle}
                        </Link>
                    </CollapsibleContent>
                </Collapsible>
        </div>
    )
}

export default MailboxItemDisplay;