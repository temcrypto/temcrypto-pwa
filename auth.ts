import NextAuth, { type NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { validateJWT } from './lib/authHelpers';

type User = {
  id: string;
  email: string;
};

export const authConfig = {
  pages: {
    signIn: '/signin',
  },
  secret: process.env.AUTH_SECRET,
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      // const isLoggedIn = !!auth?.user;
      // const isOnDashboardPage = nextUrl.pathname.startsWith('/');

      // if (isOnDashboardPage) {
      //   if (!isLoggedIn) return false;
      // } else if (isLoggedIn) {
      //   return Response.redirect(new URL('/', nextUrl));
      // }

      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: 'dynamic',
      credentials: { token: { label: 'Token', type: 'password' } },
      async authorize(
        credentials: Partial<Record<'token', unknown>>
      ): Promise<User | null> {
        const token = credentials.token as string;

        if (typeof token !== 'string' || !token) {
          throw new Error('Token is required as an string');
        }

        const jwtPayload = await validateJWT(token);
        console.log('jwPayload', jwtPayload);

        if (jwtPayload) {
          // Transform the JWT payload into your user object
          const user: User = {
            id: jwtPayload.sub!, // Assuming 'sub' is the user ID
            email: jwtPayload.email || '', // Replace with actual field from JWT payload
          };
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  debug: true,
});
