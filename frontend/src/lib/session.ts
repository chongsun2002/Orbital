"use server"

import { cookies } from "next/headers";
import { User } from "./authActions";


export async function createSession(user: User) {
    const expires = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
    cookies().set('session', JSON.stringify({
        name: user.name,
        image: user.image,
        JWT: user.token
    }), {
        httpOnly: true,
        // secure: true,
        expires: expires,
        sameSite: 'lax',
        path: '/',
    });
}

export async function endSession() {
    cookies().set('session', '', { expires: new Date(0) });
}
