"use server"

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtDecode } from "jwt-decode";

export async function getUserId() {
    const jwt = cookies().get('JWT');
    if (jwt === undefined) {
        redirect('/login');
    }
    const decoded = jwtDecode(jwt.value);
    const id: string | undefined = decoded.sub;
    if (id === undefined) {
        redirect('/login');
    }
    return id;
}