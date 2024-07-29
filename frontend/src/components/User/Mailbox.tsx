import { Notification } from "@/lib/types/userTypes";
import { useState } from "react";
import { LuMail } from "react-icons/lu"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { ScrollArea } from "../ui/scroll-area";
import MailboxItemDisplay from "./MailboxItemDisplay";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

type MailboxProps = {
    notifications: Notification[]
    viewNotification: (notificationId: string) => Promise<any>;
    deleteNotifications: (notificationIds: string[]) => Promise<any>;
}

const Mailbox: React.FC<MailboxProps> = ({ notifications, viewNotification, deleteNotifications } : MailboxProps) => {
    const router = useRouter();
    const [deleteIds, setDeleteIds] = useState<string[]>([])

    const handleDialogClose = (isOpen: boolean) => {
        if (deleteIds.length > 0) {
            deleteNotifications(deleteIds);
        }
        if (isOpen) {
            router.refresh();
        }
    }
    
    const addToDelete = (id: string) => {
        setDeleteIds([...deleteIds, id])
    }

    const unseenCount = notifications.filter(notification => !notification.seen).length;
    const sortedNotifications = notifications.sort((a, b) => {
        if (a.seen !== b.seen) {
            return Number(a.seen) - Number(b.seen);
        }
        return new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime();
    });
    return (
        <Dialog onOpenChange={handleDialogClose}>
            <DialogTrigger>
                <div className="flex flex-row">
                    <LuMail></LuMail>
                    {unseenCount > 0 && <div className="inline-flex items-center justify-center bg-red-600 text-white rounded-full text-xs h-3.5 px-1 -ml-2 -mt-1">
                        {unseenCount}
                    </div>}
                </div>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader className="flex flex-row items-center gap-4">
                    <DialogTitle className="flex">Notifications</DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-72">
                    {sortedNotifications.map((notification, index) => {
                        return (
                            <MailboxItemDisplay notification={notification} viewNotification={viewNotification} addToDelete={addToDelete} key={index}></MailboxItemDisplay>
                        )
                    })}
                </ScrollArea>
                <form onSubmit={
                    () => {
                        deleteNotifications(notifications.map(notification => notification.id));
                        setDeleteIds([]);
                    }
                } className="flex justify-end">
                    <Button type="submit" variant="default">
                        Clear all
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default Mailbox;