"use server"

import { cookies } from "next/headers";
import { API_URL } from "./utils";
import { redirect } from "next/navigation";

export interface Friend {
    id: string,
    name: string,
    image?: string
}

export async function getFriends() {
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
            'Authorization': jwt
        }
    });
    if (!response.ok) {
        throw new Error("Could not reach server");
    }
    const responseBody = await response.json();
    return responseBody.friends.friends;
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
        }
    });
    if (!response.ok) {
        throw new Error("Could not reach server");
    }
    const responseBody = await response.json();
    return responseBody.isFriends;
}
