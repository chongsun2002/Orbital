"use server"

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { API_URL } from "./utils";

interface ActivityDetails {
    title: string,
    description?: string,
    date: {
        from: Date,
        to: Date
    },
    startTime: string,
    endTime: string,
    numOfParticipants: number
    category: string,
    location: string
}

export async function createActivity(details: ActivityDetails) {
    const startDateTime = details.date.from;
    startDateTime.setHours(Number(details.startTime.split(':')[0]))
    startDateTime.setMinutes(Number(details.startTime.split(':')[1]))

    const endDateTime = details.date.to;
    endDateTime.setHours(Number(details.endTime.split(':')[0]))
    endDateTime.setMinutes(Number(details.endTime.split(':')[1]))
    const params = {
        title: details.title,
        description: details.description, 
        startTime: startDateTime,
        endTime: endDateTime,
        numOfParticipants: details.numOfParticipants, 
        category: details.category,
        location: details.location,
    }

    const jwt = cookies().get('JWT')
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

export interface ActivityListDetails {
    id: string;
    title: string;
    description?: string; 
    startTime: string;
    endTime: string;
    organiserId: string;
    numOfParticipants: number
    organiser: {
        name: string;
    }
}

export async function getActivities(search: string, pageNum: number, category: string, date: string, location: string): Promise<{ activities: ActivityListDetails[] }> {
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

export async function getActivity(id: string): Promise<{ activity: ActivityListDetails }> {
    const params = new URLSearchParams({
        activityId: id,
    })
    const url = new URL('api/v1/activities/searchactivity', API_URL);
    url.search = params.toString();
    const response: Response = await fetch(url.toString(), {
        method: 'GET',
        cache: 'no-cache'
    })
    const responseBody = await response.json();
    return responseBody;
}

export async function joinActivity() {
    const jwt = cookies().get('JWT')
    if (jwt === undefined) {
        redirect('/login');
    }
    const url = new URL('api/v1/activities/join', API_URL);
    const response: Response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': jwt?.value || "",
            cache: 'no-cache'
        }
    });
    const responseBody = await response.json();
    return responseBody;
}

export async function unjoinActivity() {
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
    });
    const responseBody = await response.json();
    return responseBody;
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

export interface EnrolledList {
    enrolledNames: string[]
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