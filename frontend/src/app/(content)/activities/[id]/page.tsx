import React from "react"
import { ActivityListDetails } from "@/lib/activityActions"
import { getActivity } from "@/lib/activityActions";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format } from "date-fns";

const activity = async ({ params }: { params : { id: string } }) => {
    let activityData: ActivityListDetails | undefined;
    try {
        activityData = (await getActivity(params.id)).activity;
    } catch (error) {
        activityData = undefined;
    }
    if (activityData == undefined) {
        return (
            <div className='flex flex-col w-full items-center gap-[12px] mt-[60vh]'>
                <Logo/>
                <h2>404 Not Found</h2>
                <p>Could not find the activity</p>
                <Button>
                    <Link href="/activities">Continue Browsing Other Activities</Link>
                </Button>
            </div>
        )
    }
    return (
        <div>
            <div className="grid grid-cols-2 gap-10 mx-[80px]">
                <img src="/testimage.png" className="py-[80px]"></img>
                <div className="mt-[80px]">
                    <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">{activityData.title}</h1>
                    <h2 className="scroll-m-20 text-2xl tracking-tight my-5">{format(activityData.startTime, "d MMMM, yyyy, h:mm a")} - {format(activityData.endTime, "d MMMM, yyyy, h:mm a")}</h2>
                    <h2 className="scroll-m-20 text-2xl tracking-tight">Organised By: {activityData.organiser.name}</h2>
                    <h2 className="scroll-m-20 text-2xl tracking-tight">Max Participants: {activityData.numOfParticipants}</h2>
                    <p className="leading-7 [&:not(:first-child)]:mt-6">{activityData.description}</p>
                    <Button className="my-3">Join Activity!</Button>
                </div>
            </div>
        </div>
    )
}

export default activity;