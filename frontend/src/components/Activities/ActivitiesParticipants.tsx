import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    
  } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "../ui/separator";
import React from "react";

interface ActivitiesParticipantsProps {
    participantNames: string[] | undefined;
}

const ActivitiesParticipants: React.FC<ActivitiesParticipantsProps> = ({ participantNames }: ActivitiesParticipantsProps) => {
    return (
        <div>
            {(typeof participantNames === 'undefined') ? <p>Could not get participants. Try again later!</p> : (
                <Dialog>
                    <DialogTrigger>{participantNames.length === 0 ? "No participants yet."
                        : participantNames.length === 1 ? participantNames[0] + " has joined!"
                        : participantNames[0] + " and " + (participantNames.length-1) + " others have joined! Click to see who else!"}</DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Participants</DialogTitle>
                            <ScrollArea>
                                {participantNames.map((participant, index) => (
                                    <div key={index}>
                                        <p>{participant}</p>
                                        <Separator/>
                                    </div>
                                ))}
                            </ScrollArea>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    )
}

export default ActivitiesParticipants;