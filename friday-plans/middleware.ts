// middleware.ts  (use src/middleware.ts if your project uses the /src directory)
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Public routes (not requiring auth). The (.*) allows Clerk's callbacks under those paths.
const isPublicRoute = createRouteMatcher([
  '/',            // home
  '/sign-in(.*)', // Clerk sign-in & callbacks
  '/sign-up(.*)', // Clerk sign-up & callbacks
]);

export default clerkMiddleware(async (auth, req) => {
  const session = await auth();
  const url = req.nextUrl;

  // Let public routes through
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // Protect everything else: redirect unauthenticated users to sign-in
  if (!session?.userId) {
    const signInUrl = new URL('/sign-in', url.origin);
    // Optional: send them back after sign-in
    signInUrl.searchParams.set('redirect_url', url.href);
    return NextResponse.redirect(signInUrl);
  }

  // Authenticated → continue
  return NextResponse.next();
});

// Run middleware on all routes except Next static assets and files.
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
