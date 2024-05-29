"use client"

import { Button } from "../ui/button";
import { isPast } from "date-fns";
import { joinActivity, unjoinActivity } from "@/lib/activityActions"
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface ActivitiesEnrollmentProps {
    endTime: string;
    isEnrolled: boolean | undefined;
    activityId: string;
}

const ActivitiesEnrollment: React.FC<ActivitiesEnrollmentProps> = ({endTime, isEnrolled, activityId}: ActivitiesEnrollmentProps) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const onClickJoin = async () => {
        setLoading(true);
        try {
            const success = await joinActivity(activityId);
            router.refresh();
        } catch (error) {
            console.error(`Error: ${error}`)
        } finally {
            setLoading(false);
        }
    }
    const onClickUnjoin = async () => {
        setLoading(true);
        try {
            const success = await unjoinActivity(activityId);
            router.refresh();
        } catch (error) {
            console.error(`Error: ${error}`)
        } finally {
            setLoading(false);
        }
    }
    return (
        <div>
            {isPast(endTime) ? (
                <p>This activity is over!</p>
            ) : (typeof isEnrolled === "undefined") ? (
                <p>Could not get enrollment status. Try again later!</p>
            ) : isEnrolled === false ? (
                <Button onClick={onClickJoin} disabled={loading}>{loading ? "Joining..." : "Join Activity"}</Button>
            ) : (
                <Button onClick={onClickUnjoin} disabled={loading}>{loading ? "Unjoining..." : "Unjoin Activity"}</Button>
            )
            }
        </div>
    )
}

export default ActivitiesEnrollment;