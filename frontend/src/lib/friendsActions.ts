"use server"

import { cookies } from "next/headers";
import { API_URL } from "./utils";
import { redirect } from "next/navigation";

export interface Friend {
    id: string,
    name: string,
    image?: string,
    timetableUrl?: string
}

export async function getFriends(): Promise<Friend[]> {
    const session = cookies().get('session')?.value;
    const jwt = session ? JSON.parse(session).JWT : undefined;
    if (jwt === undefined) {
        redirect('/login');
    }
    const url = new URL('api/v1/friends/all', API_URL);
    const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': jwt,
        },
        cache: 'no-cache'
    });
    if(!response){
        throw new Error("Unexpected error occured");
    }
    const responseBody = await response.json();
    if (!response.ok) {
        throw new Error(response.status + responseBody.error);
    }
    return responseBody.friends.friends;
}

export async function getFriendsTimetable(): Promise<(String | undefined)[]> {
    const friends = await getFriends();
    return friends.map((friend) => friend.timetableUrl);
}

export async function isFriend(id: string): Promise<Boolean> {
    const session = cookies().get('session')?.value;
    const jwt = session ? JSON.parse(session).JWT : undefined;
    if (jwt === undefined) {
        redirect('/login');
    }
    const params = new URLSearchParams({
        userId: id,
    }); 
    const url = new URL('api/v1/friends/check', API_URL);
    url.search = params.toString();
    const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': jwt
        },
        cache: 'no-cache'
    });
    if (!response.ok) {
        throw new Error("Could not reach server");
    }
    const responseBody = await response.json();
    return responseBody.isFriends;
}

export async function sendFriendRequest(id: string, isSecret: boolean) {
    const session = cookies().get('session')?.value;
    const jwt = session ? JSON.parse(session).JWT : undefined;
    if (jwt === undefined) {
        redirect('/login');
    }
    const url = new URL('api/v1/friends/send', API_URL);
    const response = await fetch(url.toString(), {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': jwt
        },
        body: JSON.stringify({recipientId: id, isSecret: isSecret})
    });
    if (!response.ok) {
        throw new Error("Could not reach server");
    }
    return response.statusText;
}

export async function getIncomingFriendRequests() {
    const session = cookies().get('session')?.value;
    const jwt = session ? JSON.parse(session).JWT : undefined;
    if (jwt === undefined) {
        redirect('/login');
    }
    const url = new URL('api/v1/friends/incoming', API_URL);
    const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': jwt,
        },
        cache: 'no-cache'
    });
    if(!response){
        throw new Error("Unexpected error occured");
    }
    const responseBody = await response.json();
    if (!response.ok) {
        throw new Error(response.status + responseBody.error);
    }
    return responseBody.pending.receivedFriendships;
}

export async function acceptFriendRequest(id: string) {
    const session = cookies().get('session')?.value;
    const jwt = session ? JSON.parse(session).JWT : undefined;
    if (jwt === undefined) {
        redirect('/login');
    }
    const url = new URL('api/v1/friends/accept', API_URL);
    const response = await fetch(url.toString(), {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': jwt,
        },
        cache: 'no-cache',
        body: JSON.stringify({requesterId: id})
    });
    if(!response){
        throw new Error("Unexpected error occured");
    }
    const responseBody = await response.json();
    if (!response.ok) {
        throw new Error(response.status + responseBody.error);
    }
}