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
    }

    const jwt = cookies().get('JWT')
    if (jwt === undefined) {
        redirect('/')
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

export async function getActivities(search: string, pageNum: number): Promise<{ activities: ActivityListDetails[] }> {
    const params = new URLSearchParams({
        search: search,
        pageNum: pageNum.toString()
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
        id: id,
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