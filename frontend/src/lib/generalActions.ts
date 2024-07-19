"use server"

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { API_URL } from "./utils";
import { createSession, endSession } from "./session";
import { getColorAssignments, setColorAssignments } from "./courseActions";
import { assignColorsToModules, parseNUSModsURL } from "./courseUtils";

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
