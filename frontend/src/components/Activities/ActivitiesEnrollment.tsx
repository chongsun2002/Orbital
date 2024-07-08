"use client"

import { Button } from "../ui/button";
import { isPast } from "date-fns";
import { joinActivity, unjoinActivity } from "@/lib/activityActions"
import { Spinner } from "../ui/spinner";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface ActivitiesEnrollmentProps {
    endTime: string;
    isEnrolled: boolean | undefined;
    activityId: string;
}

const ActivitiesEnrollment: React.FC<ActivitiesEnrollmentProps> = ({endTime, isEnrolled, activityId}: ActivitiesEnrollmentProps) => {
    const router = useRouter();
    const [joining, setJoining] = useState(false);

    const onClickJoin = async () => {
        setJoining(true);
        try {
            await joinActivity(activityId);
            router.refresh();
        } catch (error) {
            console.error(`Error: ${error}`)
        } finally {
            setJoining(false);
        }
    }
    const onClickUnjoin = async () => {
        setJoining(true);
        try {
            await unjoinActivity(activityId);
            router.refresh();
        } catch (error) {
            console.error(`Error: ${error}`)
        } finally {
            setJoining(false);
        }
    }
    return (
        <div>
            {isPast(endTime) ? (
                <p>This activity is over!</p>
            ) : (typeof isEnrolled === "undefined") ? (
                <p>Could not get enrollment status. Try again later!</p>
            ) : isEnrolled === false ? (
                <Button onClick={onClickJoin} disabled={joining}>{joining ? (
                    <div className="flex flex-row">
                        <Spinner/>
                        <p>Joining...</p>
                    </div>
                ) : "Join Activity"}</Button>
            ) : (
                <Button onClick={onClickUnjoin} disabled={joining}>{joining ? (
                    <div className="flex flex-row">
                        <Spinner/>
                        <p>Leaving...</p>
                    </div>
                ) : "Leave Activity"}</Button>
            )
            }
        </div>
    )
}

export default ActivitiesEnrollment;