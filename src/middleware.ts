import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// For the MVP demo, we'll use a simple middleware that doesn't perform any auth checks
// This allows us to test the app without Supabase

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const path = request.nextUrl.pathname;

  // Redirect root to /login for demo purposes (first-time visitors)
  if (path === '/' && !request.cookies.has('demo_user')) {
    // Set a demo cookie to avoid redirecting on subsequent visits
    response.cookies.set('demo_user', 'true', { maxAge: 60 * 60 * 24 }); // 1 day
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};
