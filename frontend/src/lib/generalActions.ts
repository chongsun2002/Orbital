"use server"

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { API_URL } from "./utils";
import { createSession, endSession } from "./session";
import { getColorAssignments, setColorAssignments } from "./courseActions";
import { assignColorsToModules, parseNUSModsURL } from "./courseUtils";

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

export async function getUserId() {
    const session = cookies().get('session')
    if(!session) {
        redirect('/login');
    }
    const jwt: string = JSON.parse(session.value).JWT;
    const decoded = jwtDecode(jwt);
    const id: string | undefined = decoded.sub;
    if(!id) {
        await endSession();
        redirect('/login');
    }
    return id;
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

export async function updateUserTimetableColors(url: string) {
    "use server"
    const courses = parseNUSModsURL(url);
    const courseColorAssignment = await getColorAssignments();
    let currIndex = courseColorAssignment.currentColorIndex;
    const colorAssignment = courseColorAssignment.colorAssignments;
    for (const course in courses) {
        if (colorAssignment[course] === undefined) {
            const color = assignColorsToModules(currIndex);
            currIndex = color.newIndex;
            colorAssignment[course] = color.assignedColor;
        }
    }
    await setColorAssignments(currIndex,colorAssignment);
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