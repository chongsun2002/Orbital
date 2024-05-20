import { RequestCookies } from 'next/dist/compiled/@edge-runtime/cookies';
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export async function middleware(request: NextRequest) {
    const cookieStore: RequestCookies = request.cookies;

    if (request.nextUrl.pathname.startsWith('/signup') && cookieStore.get('JWT')) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    if (request.nextUrl.pathname.startsWith('/login') && cookieStore.get('JWT')) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    if (request.nextUrl.pathname.startsWith('/logout')) {
        const response: NextResponse = NextResponse.redirect(new URL('/success', request.url));
        response.cookies.delete('JWT');
        response.cookies.delete('userName');
        response.cookies.delete('image');
        return response;
    }
  }