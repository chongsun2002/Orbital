"use server"

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { API_URL } from "./utils";

export interface UserDetails {
    name: string,
    image?: string,
    bio?: string,
    birthday?: string
}

export interface UpdateUserDetails {
    name: string,
    bio?: string,
    birthday?: Date
}

export async function getUserId() {
    const session = cookies().get('session')?.value;
    const jwt: string = session ? JSON.parse(session).JWT : '';
    const decoded = jwtDecode(jwt);
    const id: string | undefined = decoded.sub;
    return id;
}

export async function getUserDetails(id: string) {
    const session = cookies().get('session');
    if (session === undefined) {
        redirect('/login');
    }
    const jwt: string = JSON.parse(session.value).JWT;
    const url = new URL(`api/v1/user/details/${id}`, API_URL);
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
    const details: UserDetails = await response.json().then(res => res.user); 
    return details;
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
    if (!response.ok) {
        throw new Error("Could not reach server");
    }
    const responseBody = await response.json();
    return responseBody.isPublic;
}

export async function updateUserDetails(data: UpdateUserDetails) {
    const session = cookies().get('session')
    if (session === undefined) {
        redirect('/login');
    }
    const jwt: string = JSON.parse(session.value).JWT;
    const url = new URL(`api/v1/user/update/`, API_URL);
    const response = await fetch(url.toString(), {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': jwt
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        throw new Error("Could not reach server");
    }
}