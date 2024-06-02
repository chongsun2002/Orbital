"use server"

import { cookies } from "next/headers";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { redirect } from "next/navigation";
import { API_URL } from "./utils";
import { CreateActivityDetails, SearchedActivity, Activity, CreatedActivityDetails, EnrolledList } from "./types/activityTypes";

// Methods to interact with backend

/**
 * Creates an activity on the backend with all the necessary details.
 *
 * @param details - the details of the activity necessary for it's creation
 * @returns A promise of CreatedActivityDetails.
 */
export async function createActivity(details: CreateActivityDetails): Promise<CreatedActivityDetails> {
    const startDateTime: Date = details.date.from;
    startDateTime.setHours(Number(details.startTime.split(':')[0]));
    startDateTime.setMinutes(Number(details.startTime.split(':')[1]));

    const endDateTime: Date = details.date.to;
    endDateTime.setHours(Number(details.endTime.split(':')[0]));
    endDateTime.setMinutes(Number(details.endTime.split(':')[1]));

    const params = {
        title: details.title,
        description: details.description, 
        startTime: startDateTime,
        endTime: endDateTime,
        numOfParticipants: details.numOfParticipants, 
        category: details.category,
        location: details.location,
    }

    const jwt: RequestCookie | undefined = cookies().get('JWT');
    if (jwt === undefined) {
        redirect('/login')
    }
    const url = new URL('api/v1/activities/create', API_URL)
    const response: Response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': jwt.value
        },
        body: JSON.stringify(params),
        next: { revalidate: false },
        cache: 'no-cache'
    });
    return response.json();
}

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
export async function getActivities(search: string, pageNum: number, category: string, date: string, location: string): Promise<{ activities: SearchedActivity[] }> {
    const params = new URLSearchParams({
        search: search,
        pageNum: pageNum.toString(),
        category: category,
        date: date,
        location: location
    });
    const url = new URL('api/v1/activities/searchactivities', API_URL);
    url.search = params.toString();
    const response: Response = await fetch(url.toString(), {
        method: 'GET',
        cache: 'no-cache'
    });
    const responseBody = await response.json();
    return responseBody;
}

/**
 * 
 * @param id - activity's Id. This is the same id as on the database. 
 * @returns 
 */
export async function getActivity(id: string): Promise<{ activity: SearchedActivity }> {
    const params = new URLSearchParams({
        activityId: id,
    })
    const url = new URL('api/v1/activities/searchactivity', API_URL);
    url.search = params.toString();
    const response: Response = await fetch(url.toString(), {
        method: 'GET',
        cache: 'no-cache'
    })
    return response.json();
}

export async function joinActivity(id: string): Promise<{ activities: Activity }> {
    const jwt = cookies().get('JWT')
    if (jwt === undefined) {
        redirect('/login');
    }
    const url = new URL('api/v1/activities/join', API_URL);
    const response: Response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': jwt?.value,
            cache: 'no-cache'
        },
        body: JSON.stringify({activityId: id}),
    });
    return response.json();
}

export async function unjoinActivity(id: string): Promise<{activities: Activity }> {
    const jwt = cookies().get('JWT')
    if (jwt === undefined) {
        redirect('/login');
    }
    const url = new URL('api/v1/activities/unjoin', API_URL);
    const response: Response = await fetch(url.toString(), {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': jwt?.value || "",
            cache: 'no-cache'
        },
        body: JSON.stringify({activityId: id}),
    });
    return response.json();
}

export async function checkActivityEnrollment(id: string) : Promise<boolean> {
    const jwt = cookies().get('JWT')
    const params = new URLSearchParams({
        activityId: id
    })
    const url = new URL('api/v1/activities/checkenrollment', API_URL)
    url.search = params.toString();
    const response: Response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': jwt?.value || ""
        },
        cache: 'no-cache'
    });
    const responseStatus: number = response.status;
    if (responseStatus !== 200) {
        return false;
    }
    const responseBody = await response.json();
    return responseBody.enrolled;
}

export async function getActivityParticipants(id: string): Promise<EnrolledList> {
    const jwt = cookies().get('JWT')
    const params = new URLSearchParams({
        activityId: id
    })
    const url = new URL('api/v1/activities/getparticipants', API_URL)
    url.search = params.toString();
    const response: Response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': jwt?.value || ""
        },
        cache: 'no-cache'
    });
    const responseBody = await response.json();
    return responseBody;
}