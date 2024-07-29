"use server"
import { cookies } from "next/headers";
import { createSession } from "./session";
import { API_URL } from "./utils";
import { OAuth2Client } from 'google-auth-library';
import { redirect } from "next/navigation";

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
        next: { revalidate: 0 }
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
        next: { revalidate: 0 }
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

export async function handleGoogle(response: any) {
    const client = new OAuth2Client();
    const ticket = await client.verifyIdToken({
        idToken: response.credential,
        audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID 
    });
    const payload = ticket.getPayload();
    if(!payload) {
        throw new Error("Google JWT invalid");
    }
    const googleId: string = payload['sub'];
    const name: string = payload['name'] ?? ''; 
    const email: string = payload['email'] ?? '';
    const image: string | undefined = payload['picture'];

    const url = new URL('api/v1/auth/google', API_URL);
    const res: Response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            googleId: googleId,
            name: name,
            email: email,
            image: image
        }),
        next: { revalidate: 0 }
    }); 
    if(!res) {
        throw new Error("There was an unexpected error signing in with Google. The server might be down.");
    }
    const responseBody = await res.json();
    if(!res.ok) {
        throw new Error("There was an unexpected error signing in with Google " + responseBody.error);
    }

    try {
        const user: User = {
            name: responseBody.user.name,
            image: responseBody.user.image,
            token: responseBody.token,
        };
        createSession(user);
    } catch (error) {
        throw new Error((error as Error).message);
    } 
}

export async function forgetPassword(email: string) {
    const url = new URL('api/v1/auth/forgetpassword', API_URL);
    const response: Response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email
        }),
        cache: 'no-cache'
    });
    return response.status;
}

export async function resetPassword(newPassword: string) {
    const jwt = cookies().get('tempsession')?.value;
    const url = new URL(`api/v1/auth/resetpassword`, API_URL)
    const response: Response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': jwt || ""
        },
        body: JSON.stringify({
            password: newPassword
        }),
        cache: 'no-cache'
    });
    if (response.status === 200) {
        cookies().set('tempsession', '', { maxAge: 0 })
    }
    return response.status;
}