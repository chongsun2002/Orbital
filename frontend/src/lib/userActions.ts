"use server"

import { SearchedUserDetails } from "./types/userTypes";
import { API_URL } from "./utils";
import { Notification } from "./types/userTypes";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { mailAssociatedItem } from "./userUtils";

/**
 * Creates an activity on the backend with all the necessary details.
 *
 * @param search - input of the user into the search field.
 * @param pageNum - number of the page of activities that the user has navigated to.
 * @param category - category the user has selected.
 * @param date - date the user has selected.
 * @param location - location the user has selected.
 * @returns A promise of CreatedActivityDetails.
 */
export async function getUsers(search: string): Promise<{ users: SearchedUserDetails[] }> {
    const params = new URLSearchParams({
        search: search,
    });
    const url = new URL('api/v1/user/search', API_URL);
    url.search = params.toString();
    const response: Response = await fetch(url.toString(), {
        method: 'GET',
        cache: 'no-cache'
    });
    if (!response.ok) {
        throw new Error("Could not reach server");
    }
    return response.json();
}

export async function getNotifications(): Promise<Notification[]> {
    const session = cookies().get('session')?.value;
    const jwt = session ? JSON.parse(session).JWT : undefined;
    if (jwt === undefined) {
        redirect('/login');
    }
    const url = new URL('api/v1/user/getnotifications', API_URL);
    const response: Response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': jwt,

        },
        cache: 'no-cache'
    });
    if (!response.ok) {
        throw new Error("Could not reach server");
    }
    const notifications: Notification[] = await response.json();

    const notificationsWithAssociatedItems = await Promise.all(notifications.map(async (notification) => {
        notification.associatedItem = await mailAssociatedItem(notification.notificationType, notification.additionalContentId);
        return notification;
    }));

    return notificationsWithAssociatedItems;
}

export async function sendMessage(receipientId: string, message: string) {
    const session = cookies().get('session')?.value;
    const jwt = session ? JSON.parse(session).JWT : undefined;
    if (jwt === undefined) {
        redirect('/login');
    }
    const url = new URL(`api/v1/user/sendmessage`, API_URL);
    const response: Response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': jwt,
        },
        body: JSON.stringify({
            receipientId: receipientId,
            content: message,
        }),
        cache: 'no-cache'
    });
    if (!response.ok) {
        throw new Error("Could not reach server");
    }
}

export async function viewNotification(notificationId: string) {
    const session = cookies().get('session')?.value;
    const jwt = session ? JSON.parse(session).JWT : undefined;
    if (jwt === undefined) {
        redirect('/login');
    }
    const url = new URL(`api/v1/user/viewnotification/${notificationId}`, API_URL);
    const response: Response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': jwt,

        },
        cache: 'no-cache'
    });
    
    if (!response.ok) {
        throw new Error("Could not reach server");
    }
}

export async function deleteNotifications(notificationIds: string[]) {
    const session = cookies().get('session')?.value;
    const jwt = session ? JSON.parse(session).JWT : undefined;
    if (jwt === undefined) {
        redirect('/login');
    }
    const url = new URL(`api/v1/user/deletenotifications/`, API_URL);
    const response: Response = await fetch(url.toString(), {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': jwt,
        },
        body: JSON.stringify({notifications: notificationIds}),
        cache: 'no-cache'
    });
    if (!response.ok) {
        throw new Error("Could not reach server");
    }
    return response.json();
}