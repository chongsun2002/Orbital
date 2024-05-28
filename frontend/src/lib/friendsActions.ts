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
    const jwt = cookies().get('JWT');
    if (jwt === undefined) {
        redirect('/login');
    }
    const url = new URL('api/v1/friends/all', API_URL);
    const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
            'Authorization': jwt.value
        }
    }).then(res => res.json());
    return response.friends.friends;
}