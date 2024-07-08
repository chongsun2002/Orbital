import { RequestCookies } from 'next/dist/compiled/@edge-runtime/cookies';
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const cookieStore: RequestCookies = request.cookies;

    if (request.nextUrl.pathname.startsWith('/signup') && cookieStore.get('session')) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    if (request.nextUrl.pathname.startsWith('/login') && cookieStore.get('session')) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    if (request.nextUrl.pathname.startsWith('/activity/create') && !cookieStore.get('session')) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    if (request.nextUrl.pathname.startsWith('/logout')) {
        const response: NextResponse = NextResponse.redirect(new URL('/success', request.url));
        return response;
    }
    
    if (request.nextUrl.pathname.startsWith('/user') && !cookieStore.get('session')) {
        return NextResponse.redirect(new URL('/login', request.url));
    }
}