import { RequestCookies } from 'next/dist/compiled/@edge-runtime/cookies';
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getUserDetails } from './lib/generalActions';


export async function middleware(req: NextRequest) {
    const cookieStore: RequestCookies = req.cookies;
    const url = req.nextUrl
    if (url.pathname.startsWith('/activity/create') && !cookieStore.get('session')) {
        return NextResponse.redirect(new URL('/login', req.url))
    }

    if (url.pathname.startsWith('/logout')) {
        const response: NextResponse = NextResponse.redirect(new URL('/success', req.url));
        return response;
    }
    
    if (url.pathname.startsWith('/user') && !cookieStore.get('session')) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    if (url.pathname.startsWith('/reset_password')) {
        if (cookieStore.get("tempsession") || cookieStore.get("session")) {
            return;
        }
        const token = url.searchParams.get("token");
        if (!token) {
            return NextResponse.redirect(new URL('/login', req.url))
        }
        url.searchParams.delete("token");
        const response = NextResponse.redirect(url);
        response.cookies.set('tempsession', "Bearer " + token, { maxAge: 10 * 60 * 1000 })
        return response;
    }
}