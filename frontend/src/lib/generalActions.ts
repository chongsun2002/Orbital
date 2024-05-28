import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { API_URL } from "./utils";


export async function getUserId() {
    const jwt = cookies().get('JWT');
    if (jwt === undefined) {
        redirect('/login');
    }
    const url = new URL('api/v1/auth/getId', API_URL);
    const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
            'Authorization': jwt.value
        }
    }).then(res => res.json());
    return response;
}