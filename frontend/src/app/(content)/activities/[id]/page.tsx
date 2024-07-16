import React from "react"
import { checkActivityEnrollment, checkIfOwner, getActivityParticipants,  } from "@/lib/activityActions"
import { SearchedActivity } from "@/lib/types/activityTypes";
import { getActivity } from "@/lib/activityActions";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format } from "date-fns";
import ActivitiesEnrollment from "@/components/Activities/ActivitiesEnrollment";
import ActivitiesParticipants from "@/components/Activities/ActivitiesParticipants";
import ActivityEditSheet from "@/components/Activities/ActivityEditSheet";
import ActivityRemoveButton from "@/components/Activities/ActivtiesRemoveButton";
import ActivityImage from "@/components/Activities/ActivityImage";

const activity = async ({ params }: { params : { id: string } }) => {
    const [activityResult, enrollmentResult, participantsResult, ownerResult] = await Promise.allSettled([
        getActivity(params.id),
        checkActivityEnrollment(params.id),
        getActivityParticipants(params.id),
        checkIfOwner(params.id)
    ]);

    let activityData: SearchedActivity  | undefined;
    let isEnrolled: boolean | undefined = false;
    let participants: string[] | undefined = [];
    let isOwner: boolean | undefined = false;

    // Handle individual results
    if (activityResult.status === 'fulfilled') {
        activityData = activityResult.value.activity;
    } else {
        console.error(`There was an error getting the activity: ${activityResult.reason}`);
        activityData = undefined;
    }

    if (enrollmentResult.status === 'fulfilled') {
        isEnrolled = enrollmentResult.value.enrolled;
    } else {
        console.error(`There was an error checking the enrollment status: ${enrollmentResult.reason}`);
        isEnrolled = undefined;
    }

    if (participantsResult.status === 'fulfilled') {
        participants = participantsResult.value.enrolledNames;
    } else {
        console.error(`There was an error getting activity participants: ${participantsResult.reason}`);
        participants = undefined;
    }

    if (ownerResult.status === 'fulfilled') {
        isOwner = ownerResult.value.isOwner;
    } else {
        console.error(`There was an error getting activity participants: ${ownerResult.reason}`);
        isOwner = undefined;
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
            <div className="mx-[10px] sm:grid grid-cols-2 gap-10 mx-[80px]">
                <div className="mt-10">
                    <ActivityImage image="" category={activityData.category}/>
                </div>
                <div className="mt-[80px]">
                    <div className="flex flex-col sm:flex flex-row gap-5">
                        <h1 className="scroll-m-20 text-3xl font-bold tracking-tight lg:text-5xl">{activityData.title}</h1>
                        {isOwner && (
                            <div className="flex flex-row gap-3 items-center">
                                <ActivityEditSheet 
                                    id={activityData.id} 
                                    title={activityData.title}
                                    description={activityData.description}
                                    startTime={activityData.startTime}
                                    endTime={activityData.endTime}
                                    numOfParticipants={activityData.numOfParticipants}
                                    organiserId={activityData.organiserId}
                                    category={activityData.category}
                                    location={activityData.location}/>
                                <ActivityRemoveButton id={params.id} />
                            </div>
                        )}
                    </div>
                    <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-5">{format(activityData.startTime, "d MMMM, yyyy, h:mm a")} - {format(activityData.endTime, "d MMMM, yyyy, h:mm a")}</h2>
                    <h2 className="scroll-m-20 text-xl tracking-tight">Organised By: {activityData.organiser.name}</h2>
                    <h2 className="scroll-m-20 text-xl tracking-tight">Max Participants: {activityData.numOfParticipants}</h2>
                    <p className="leading-7 [&:not(:first-child)]:my-5">{activityData.description}</p>
                    <div className="flex flex-col gap-[4px]">
                        <ActivitiesEnrollment endTime={activityData.endTime} isEnrolled={isEnrolled} activityId={params.id}></ActivitiesEnrollment>
                        <ActivitiesParticipants participantNames={participants}></ActivitiesParticipants>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default activity;