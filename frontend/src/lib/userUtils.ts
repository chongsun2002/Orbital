import { getActivity } from "./activityActions";
import { getUserDetails } from "./generalActions";

export function notificationTypeToTitle(notificationType: string, notificationAssociatedItem: string | undefined) {
    switch (notificationType) {
        case "ACTIVITYCHANGE":
            return `Change in Activity Details for ${notificationAssociatedItem}`;
        case "FRIENDREQUEST":
            return `New Friend Request from ${notificationAssociatedItem}`;
        case "ANONFRIENDREQUEST":
            return `Anonymous Friend Request Match with ${notificationAssociatedItem}`;
        case "ACTIVITYCANCEL":
            return `The activity "${notificationAssociatedItem}" has been cancelled`;
        case "MESSAGE":
            return `You have received a message from ${notificationAssociatedItem}`;
        default:
            return "Others";
    }
}


export function mailNextAction(notificationType: string) {
    switch (notificationType) {
        case "ACTIVITYCHANGE":
            return "View Activity";
        case "FRIENDREQUEST":
            return "View Profile";
        case "ANONFRIENDREQUEST":
            return "View Profile";
        case "ACTIVITYCANCEL":
            return "View Other Activities";
        case "MESSAGE":
            return "View Profile";
        default:
            return "";
    }
}

export function mailNextLinkHref(notificationType: string, additionalId: string | null) {
    switch (notificationType) {
        case "ACTIVITYCHANGE":
            return `/activities/${additionalId}`;
        case "FRIENDREQUEST":
            return `/user/${additionalId}`;
        case "ANONFRIENDREQUEST":
            return `/user/${additionalId}`;
        case "ACTIVITYCANCEL":
            return "/activities";
        case "MESSAGE":
            return `/user/${additionalId}`;
        default:
            return "/";
    }
}

export async function mailAssociatedItem(notificationType: string, additionalId: string | null) : Promise<string> {
    if (additionalId === null) {
        return "";
    }
    if (notificationType === "ACTIVITYCHANGE" || notificationType === "ACTIVITYCANCEL") {
        const activity = (await getActivity(additionalId)).activity;
        return activity.title;
    }
    if (notificationType === "FRIENDREQUEST" || notificationType === "ANONFRIENDREQUEST" || notificationType === "MESSAGE") {
        return (await getUserDetails(additionalId)).name;
    }
    return ""
}