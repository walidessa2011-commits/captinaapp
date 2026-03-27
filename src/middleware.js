import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Get cookies
  const uid = request.cookies.get('uid')?.value;
  const role = request.cookies.get('role')?.value;

  // Define protected routes
  const isAdminRoute = pathname.startsWith('/admin');
  const isTrainerRoute = pathname.startsWith('/trainer');
  const isProfileRoute = pathname.startsWith('/profile');

  // 1. Admin Route Protection
  if (isAdminRoute) {
    if (!uid || role !== 'admin') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // 2. Trainer Route Protection
  if (isTrainerRoute) {
    if (!uid || (role !== 'trainer' && role !== 'admin')) {
      // Admins are allowed in trainer routes, but trainers are not allowed in admin routes
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // 3. Profile Route Protection (Basic User Auth)
  if (isProfileRoute) {
    if (!uid) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/admin/:path*',
    '/trainer/:path*',
    '/profile/:path*',
  ],
};
