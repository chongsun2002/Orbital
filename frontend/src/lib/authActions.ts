"use server"
import { createSession, endSession } from "./session";

export type User = {
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

type loginResponse = {
    user: {
        name: string,
        image: string,
    };
    token: string;
}

export async function login(values: loginParams) : Promise<void> {
    const response: Response = await fetch('http://localhost:8000/api/v1/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(values),
        next: { revalidate: false }
    });
    const responseBody: loginResponse = await response.json();
    const user: User = {
        name: responseBody.user.name,
        image: responseBody.user.image,
        token: responseBody.token,
    };
    createSession(user);
}

export async function signup(values: signupParams) : Promise<void> {
    const response: Response = await fetch('http://localhost:8000/api/v1/auth/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(values),
        next: { revalidate: false }
    });
    const responseBody: loginResponse = await response.json();
    const user: User = {
        name: responseBody.user.name,
        image: responseBody.user.image,
        token: responseBody.token,
    };
    await createSession(user);
}

export async function logout() : Promise<void> {
    await endSession();
}