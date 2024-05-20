"use server"
import { redirect } from "next/navigation";
import { createSession } from "./session";

interface ActivityDetails {
    title: string,
    description?: string,
    startTime: Date,
    endTime: Date,
    numOfParticipants: number
}

type createResponse = {
    activityId: string;
}

export async function createActivity(details: ActivityDetails) {
    const response: Response = await fetch('http://localhost:8000/api/v1/activities/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(details),
        next: { revalidate: false }
    });
    return response;
}

export async function signup(values: signupParams) : Promise<number> {
    const response: Response = await fetch('http://localhost:8000/api/v1/auth/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(values),
        next: { revalidate: false }
    });
    const responseBody: loginResponse = await response.json();
    try {
        const user: User = {
            name: responseBody.user.name,
            image: responseBody.user.image,
            token: responseBody.token,
        };
        await createSession(user);
    } catch (error) {
        console.error(error);
    } finally {
        return response.status;
    }
}