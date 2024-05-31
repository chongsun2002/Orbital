"use server"

import { cookies } from "next/headers";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { redirect } from "next/navigation";
import { API_URL } from "./utils";
import { CreateActivityDetails, SearchedActivity, Activity, CreatedActivityDetails, EnrolledList, UpdateActivityDetails } from "./types/activityTypes";

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
        cache: 'no-cache'
    });
    if (!response.ok) {
        throw new Error("Could not reach server");
    }
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
    if (!response.ok) {
        throw new Error("Could not reach server");
    }
    return response.json();
}

/**
 * 
 * @param id - activity's Id. This is the same id as on the database. 
 * @returns 
 */
export async function getActivity(id: string): Promise<{ activity: SearchedActivity }> {
    const url = new URL(`api/v1/activities/searchactivity/${id}`, API_URL);
    const response: Response = await fetch(url.toString(), {
        method: 'GET',
        cache: 'no-cache'
    })
    if (!response.ok) {
        throw new Error("Could not reach server");
    }
    return response.json();
}

export async function joinActivity(id: string): Promise<{ activities: Activity }> {
    const jwt = cookies().get('JWT')
    if (jwt === undefined) {
        redirect('/login');
    }
    const url = new URL(`api/v1/activities/join/${id}`, API_URL);
    const response: Response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': jwt?.value,
        },
        cache: 'no-cache'
    });
    if (!response.ok) {
        throw new Error("Could not reach server");
    }
    return response.json();
}

export async function unjoinActivity(id: string): Promise<{activities: Activity }> {
    const jwt = cookies().get('JWT')
    if (jwt === undefined) {
        redirect('/login');
    }
    const url = new URL(`api/v1/activities/unjoin/${id}`, API_URL);
    const response: Response = await fetch(url.toString(), {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': jwt?.value || "",
        },
        cache: 'no-cache'
    });
    if (!response.ok) {
        throw new Error("Could not reach server");
    }
    return response.json();
}

export async function checkActivityEnrollment(id: string) : Promise<{ enrolled: boolean }> {
    const jwt = cookies().get('JWT')
    const url = new URL(`api/v1/activities/checkenrollment/${id}`, API_URL)
    const response: Response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': jwt?.value || ""
        },
        cache: 'no-cache'
    });
    const responseStatus: number = response.status;
    if (!response.ok) {
        throw new Error("Could not reach server");
    }
    return response.json();
}

export async function getActivityParticipants(id: string): Promise<EnrolledList> {
    const jwt = cookies().get('JWT')
    const url = new URL(`api/v1/activities/getparticipants/${id}`, API_URL)
    const response: Response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': jwt?.value || ""
        },
        cache: 'no-cache'
    });
    if (!response.ok) {
        throw new Error("Could not reach server");
    }
    return response.json();
}

export async function editActivity(id: string, data: UpdateActivityDetails): Promise<Activity> {
    const jwt: RequestCookie | undefined = cookies().get('JWT');
    if (jwt === undefined) {
        redirect('/login')
    }
    const url = new URL(`api/v1/activities/edit/${id}`, API_URL)
    const response: Response = await fetch(url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': jwt?.value || "",

        },
        body: JSON.stringify(data),
        cache: 'no-cache'
    })
    if (!response.ok) {
        throw new Error("Could not reach server");
    }
    return response.json();
}

export async function checkIfOwner(id: string): Promise<{ isOwner: boolean }> {
    const jwt: RequestCookie | undefined = cookies().get('JWT');
    if (jwt === undefined) {
        redirect('/login')
    }
    const url = new URL(`api/v1/activities/checkisorganiser/${id}`, API_URL);
    const response: Response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': jwt?.value || "",

        },
    })
    if (!response.ok) {
        throw new Error("Could not reach server");
    }
    return response.json();
}

export async function countActivities(): Promise<{activityCount: number}> {
    const url = new URL(`api/v1/activities/countactivities`, API_URL);
    const response: Response = await fetch(url, {
        method: 'GET'
    })
    if (!response.ok) {
        throw new Error("Could not reach server");
    }
    return response.json();
}