import { NextRequest, NextResponse } from 'next/server';

// Routes accessible without authentication
const PUBLIC_ROUTES = ['/', '/login'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  // Allow Next.js internals and static files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Check for auth token in cookies (set by the frontend after login)
  const token = request.cookies.get('token')?.value;
  // Also check legacy cookie name for backward compatibility
  const legacyToken = request.cookies.get('authToken')?.value;

  if (!token && !legacyToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
