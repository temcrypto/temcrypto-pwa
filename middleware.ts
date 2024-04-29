export { auth as default } from '@/auth';

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - .*\.png$ (Any path ending in .png)
     * - .*\.svg$ (Any path ending in .svg)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.webmanifest|sw.js|workbox*.js|.*\\.png|.*\\.svg$).*)',
  ],
};
