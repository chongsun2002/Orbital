"use server"

import { SearchedUserDetails } from "./types/userTypes";
import { API_URL } from "./utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { updateUserTimetableColors } from "./generalActions";
import { createSession } from "./session";

export interface UserDetails {
    name: string,
    image?: string,
    bio?: string,
    birthday?: string,
    timetableUrl?: string,
}

export interface UpdateUserDetails {
    name: string,
    bio?: string,
    birthday?: Date,
    timetableUrl?: string
}

export async function getUserDetails(id: string) : Promise<UserDetails> {
    const session = cookies().get('session')?.value;
    const jwt = session ? JSON.parse(session).JWT : undefined;
    if (jwt === undefined) {
        redirect('/login');
    }
    const url = new URL(`api/v1/user/details/${id}`, API_URL);
    const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': jwt
        }
    });
    if (!response) {
        throw new Error("Could not reach server");
    }
    const responseBody = await response.json();
    if (!response.ok) {
        throw new Error(response.status + responseBody.error)
    }
    return responseBody.user;
}

export async function userIsPublic(id: string) {
    const params = new URLSearchParams({
        id: id,
    }); 
    const url = new URL(`api/v1/user/public`, API_URL);
    url.search = params.toString();
    const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
        }
    });
    if (!response) {
        throw new Error("Could not reach server");
    }
    const responseBody = await response.json();
    if (!response.ok) {
        throw new Error(response.status + responseBody.error)
    }
    return responseBody.isPublic;
}

export async function updateUserDetails(data: UpdateUserDetails) {
    const session = cookies().get('session')?.value;
    const jwt = session ? JSON.parse(session).JWT : undefined;    
    if (jwt === undefined) {
        redirect('/login');
    }
    if (data.timetableUrl) {
        updateUserTimetableColors(data.timetableUrl);
    }
    const url = new URL(`api/v1/user/update/`, API_URL);
    const response = await fetch(url.toString(), {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': jwt
        },
        body: JSON.stringify(data)
    });
    if (!response) {
        throw new Error("Could not reach server");
    }
    const responseBody = await response.json();
    if (!response.ok) {
        throw new Error(response.status + responseBody.error)
    }
    const oldSession = JSON.parse(cookies().get('session')?.value ?? '');
    createSession({
        name: data.name,
        image: oldSession.image,
        token: oldSession.JWT, 
    })
    return responseBody;
}

/**
 * @param search - input of the user into the search field.
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