import "server-only";
import { cookies } from "next/headers";
import { User } from "./authActions";

export function createSession(user: User) {
    const expires = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
    cookies().set('userName', user.name, {
        httpOnly: true,
        secure: true,
        expires: expires,
        sameSite: 'lax',
        path: '/',
    });
    cookies().set('userImage', user.image, {
        httpOnly: true,
        secure: true,
        expires: expires,
        sameSite: 'lax',
        path: '/',
    });
    cookies().set('JWT', user.token, {
        httpOnly: true,
        secure: true,
        expires: expires,
        sameSite: 'lax',
        path: '/',
    });
}