"use server"
import { createSession } from "./session";
import { API_URL } from "./utils";

export interface User {
    name: string;
    image: string;
    token: string;
}

interface loginParams {
    email: string;
    password: string;
}

interface signupParams {
    email: string;
    name: string;
    password: string;
    verifyPassword: string;
}

interface loginResponse {
    user: {
        name: string,
        image: string,
    };
    token: string;
}

export async function login(values: loginParams) : Promise<number> {
    const url = new URL('api/v1/auth/login', API_URL)
    const response: Response = await fetch(url.toString(), {
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
        createSession(user);
    } catch (error) {
        console.error(error)
    } finally {
        return response.status;
    }
}

export async function signup(values: signupParams) : Promise<number> {
    const url = new URL('api/v1/auth/signup', API_URL);
    const response: Response = await fetch(url.toString(), {
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
        createSession(user);
    } catch (error) {
        console.error(error);
    } finally {
        return response.status;
    }
}

