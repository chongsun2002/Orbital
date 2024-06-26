import React from "react"
import ActivityCard from "./ActivityCard";
import { ActivityListDetails } from "@/lib/activityActions";

export interface ActivitiesListProps {
    activities: ActivityListDetails[];
}

export interface FilteredActivity {
    id: string;
    title: string;
    description?: string;
    startTime: string;
    organiserName: string;
}

const ActivitiesList: React.FC<ActivitiesListProps> = (activities: ActivitiesListProps) => {
    const filteredActivities: FilteredActivity[] = activities.activities.map((activity) => {
        return {
            id: activity.id,
            title: activity.title,
            description: activity.description,
            startTime: activity.startTime,
            organiserName: activity.organiser.name
        }
    });

    return (
        <div className="grid grid-cols-3 gap-x-10 gap-y-5 mx-[80px]">
            {filteredActivities.map((activity, index) => {
                return (
                    <ActivityCard 
                        key={index}
                        id={activity.id}
                        title={activity.title}
                        description={activity.description}
                        startTime={activity.startTime}
                        organiserName={activity.organiserName}
                        />
                )
            })}
        </div>
    )
}

export default ActivitiesList;
