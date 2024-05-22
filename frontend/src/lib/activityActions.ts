"use server"

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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

    const response: Response = await fetch('http://localhost:8000/api/v1/activities/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': jwt.value
        },
        body: JSON.stringify(params),
        next: { revalidate: false }
    });
    return response.json();
}