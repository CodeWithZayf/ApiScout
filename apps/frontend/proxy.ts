import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get('apiscout_token')?.value;

    // Protect /profile routes — require a valid token cookie
    if (pathname.startsWith('/profile')) {
        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // Protect /admin routes — require valid token cookie + ADMIN role
    if (pathname.startsWith('/admin')) {

        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        // Decode JWT payload to check role (no verification here — backend validates)
        try {
            const payloadBase64 = token.split('.')[1];
            const payload = JSON.parse(atob(payloadBase64));

            if (payload.role !== 'ADMIN') {
                return NextResponse.redirect(new URL('/', request.url));
            }
        } catch {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/profile/:path*'],
};
