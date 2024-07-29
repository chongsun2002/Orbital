"use server"

import { NUSMODS_URL } from "./constants/generalConstants";
import { acadYear } from "./constants/courseConstants";
import { cookies } from "next/headers";
import { ParsedResult } from "./types/courseTypes";
import { assignColorsToModules } from "./courseUtils";
import { redirect } from "next/navigation";

export async function addNUSModsURLToCookies({ name, url, isFriend } : {name: string, url: string, isFriend: boolean}) {
    const cookie = cookies().get('NUSModsURLs');
    if (cookie) {
        try {
            const URLs: {name: string, url: string, isFriend: boolean,}[] = JSON.parse(cookie.value);
            URLs.push({name: name, url: url, isFriend: isFriend});
            cookies().set('NUSModsURLs', JSON.stringify(URLs), {
                httpOnly: true,
                secure: true,
                sameSite: 'lax',
                path: '/',
            })
        } catch (error) {
            throw new Error("Unable to get URLs from cookie.")
        }
    } else {
        try {
            cookies().set('NUSModsURLs', JSON.stringify([{name: name, url: url}]), {
                httpOnly: true,
                secure: true,
                sameSite: 'lax',
                path: '/',
            })
        } catch (error) {
            throw new Error("Unable to set cookies.")
        }
    }
}

export async function getNUSModsURLs(): Promise<{name: string, url: string, isFriend: boolean}[]> {
    const cookie = cookies().get('NUSModsURLs');
    if (cookie) {
        try {
            const URLs: {name: string, url: string, isFriend: boolean}[] = JSON.parse(cookie.value);
            return URLs;
        } catch (error) {
            throw new Error("Unable to get URLs from cookie.")
        }
    }
    return [];
}//

export async function deleteNUSModsURL(name: string) {
    const cookie = cookies().get('NUSModsURLs');
    if (cookie) {
        try {
            const URLs: {name: string, url: string, isFriend: boolean}[] = JSON.parse(cookie.value);
            const newURLs = URLs.filter((url) => url.name !== name);
            cookies().set('NUSModsURLs', JSON.stringify(newURLs), {
                httpOnly: true,
                secure: true,
                sameSite: 'lax',
                path: '/',
            })
        } catch (error) {
            throw new Error("Unable to get URLs from cookie.")
        }
    }
    
}

export async function editNUSModsURL(name: string, newURL: string) {
    const cookie = cookies().get('NUSModsURLs');
    if (cookie) {
        try {
            const URLs: {name: string, url: string, isFriend: boolean}[] = JSON.parse(cookie.value);
            const newURLs = URLs.map(url => {
                if (url.name === name) {
                    url.url = newURL;
                }
                return url;
            })
            cookies().set('NUSModsURLs', JSON.stringify(newURLs), {
                httpOnly: true,
                secure: true,
                sameSite: 'lax',
                path: '/',
            })
        } catch (error) {
            throw new Error("Unable to get URLs from cookie.")
        }
    }
}

export async function resetTimetable() {
    cookies().set('NUSModsURLs', JSON.stringify([]));
    redirect("/course_matching");
}

export async function getModuleCodes(): Promise<Set<string>> {
    const cookie = cookies().get('moduleCodes');
    if (cookie) {
        try {
            const parsedModuleCodes: string[] = JSON.parse(cookie.value);
            return new Set(parsedModuleCodes);
        } catch (error) {
            console.error('Error parsing module codes from cookies:', error);
        }
    }
    return new Set();
}

export async function addColorAssignments(courses: ParsedResult, currentAssignments: Record<string, string>, currIndex: number) {
    for (const course in courses) {
        if (currentAssignments[course] === undefined) {
            const color = assignColorsToModules(currIndex);
            currIndex = color.newIndex;
            currentAssignments[course] = color.assignedColor;
        }
    }
    await setColorAssignments(currIndex, currentAssignments);
}

export async function getColorAssignments(): Promise<{ currentColorIndex: number, colorAssignments: Record<string, string> }> {
    const cookie = cookies().get('timetableColorAssignments');
    if (cookie) {
        try {
            const timetableColorAssignments = JSON.parse(cookie.value);
            return {
                currentColorIndex: timetableColorAssignments.currentColorIndex,
                colorAssignments: timetableColorAssignments.colorAssignments,
            };
        } catch (error) {
            console.error('Error parsing color data from cookies:', error);
        }
    }
    return { currentColorIndex: 0, colorAssignments: {} };
}

export async function setColorAssignments(currentColorIndex: number, colorAssignments: Record<string, string>): Promise<void> {
    const timetableColorAssignments = {
        currentColorIndex,
        colorAssignments,
    };
    
    cookies().set('timetableColorAssignments', JSON.stringify(timetableColorAssignments), {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
    });
}

export async function getCourseData(moduleCode: string) {
    const url = new URL(`${acadYear}/modules/${moduleCode}.json`, NUSMODS_URL);
    const response: Response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        next: {
            revalidate: 604800
        }
    })
    if (!response.ok) {
        throw new Error("Could not reach nusmods server");
    }
    return response.json();
    // return dummyData;
}
