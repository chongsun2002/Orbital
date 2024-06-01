import React from "react"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AvatarImage, AvatarFallback, Avatar } from "../ui/avatar";
import Link from "next/link";
import { FilteredActivity } from "./ActivitiesList";
import { format, formatDistanceToNow, isFuture } from "date-fns";

type ActivityCardProps = FilteredActivity;

const ActivityCard: React.FC<ActivityCardProps> = ({ id, title, description, startTime, organiserName }: ActivityCardProps) => {
    return (
        <Card>
            <CardHeader className="bg-gray-100">
                <CardTitle>{title}</CardTitle>
                <div className="flex flex-row items-center">
                    <CardDescription>
                        Organised By {organiserName}
                    </CardDescription>
                    <Avatar className="mx-2">
                        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </div>
            </CardHeader>
            <CardContent>
                <img src="/testimage.png"></img>
            </CardContent>
            <CardFooter>
                <div className="flex flex-col w-full">
                    <p>Date: {format(startTime, "EEEE, d MMMM, yyyy")} {isFuture(startTime) ? "(In " : "("}{formatDistanceToNow(startTime)}{isFuture(startTime) ? ")" : " ago)"}</p>
                    <CardDescription className="line-clamp-1">{description}</CardDescription>
                    <Button className="my-4 px-0 py-0">
                        <Link href={`/activities/${id}`} className="w-full h-full flex items-center justify-center">Find Out More...</Link>
                    </Button>
                </div>
            </CardFooter>
        </Card>
    )
}

export default ActivityCard