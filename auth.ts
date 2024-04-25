import NextAuth, { type DefaultSession, type NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { validateJWT } from './lib/authHelpers';

type User = {
  id: string;
  email: string;
};

declare module 'next-auth' {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      customAttribute: string;
      /**
       * By default, TypeScript merges new interface properties and overwrites existing ones.
       * In this case, the default session user properties will be overwritten,
       * with the new ones defined above. To keep the default session user properties,
       * you need to add them back into the newly declared interface.
       */
    } & DefaultSession['user'];
  }
}

export const authConfig = {
  pages: {
    signIn: '/signin',
  },
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async signIn(signInData) {
      console.log('auth ~ callback ~ signIn ~ signInData', signInData);
      return true;
    },
    // authorized(authorizedData) {
    //   console.log(
    //     'auth ~ callback ~ authorized ~ authorizedData',
    //     authorizedData
    //   );

    //   const isLoggedIn = !!authorizedData.auth?.user;
    //   const isOnSigninPage =
    //     authorizedData.request.nextUrl.pathname.startsWith('/signin');

    //   if (isLoggedIn && isOnSigninPage) {
    //     return Response.redirect(new URL('/', authorizedData.request.nextUrl));
    //   }
    // },
    // authorized(authorizedData) {
    //   console.log(
    //     'auth ~ callback ~ authorized ~ authorizedData',
    //     authorizedData
    //   );
    //   // return true;

    //   const isLoggedIn = !!authorizedData.auth?.user;
    //   if (!isLoggedIn) return false;

    //   console.log('>>>>>>>>>>>>>>>>>> authorized', isLoggedIn, authorizedData.request.nextUrl);

    //   return Response.redirect(new URL('/wallet', authorizedData.request.nextUrl));

    //   // const isOnDashboardPage = nextUrl.pathname.startsWith('/');
    //   // if (isOnDashboardPage) {
    //   //   if (!isLoggedIn) return false;
    //   // } else if (isLoggedIn) {
    //   //   return Response.redirect(new URL('/', nextUrl));
    //   // }
    // },
    // async redirect(redirectData) {
    //   console.log('auth ~ callback ~ redirect ~ redirectData', redirectData);
    //   return redirectData.baseUrl;
    // },
    async jwt(jwtData) {
      console.log('auth ~ callback ~ jwt ~ jwtData 1', jwtData);
      if (jwtData.user) {
        jwtData.token.customAttribute = '';
      }
      console.log('auth ~ callback ~ jwt ~ jwtData 2', jwtData);
      return jwtData.token;
    },
    async session(sessionData) {
      console.log('auth ~ callback ~ session ~ sessionData 1', sessionData);
      if (sessionData.token) {
        sessionData.session.user.customAttribute = sessionData.token
          .customAttribute as string; // Transfer custom attributes to the session
      }
      console.log('auth ~ callback ~ session ~ sessionData 2', sessionData);
      return sessionData.session;
    },
  },
  providers: [],
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
  debug: true,
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
        console.log('authorize ~ dynamic ~ jwtPayload', jwtPayload);

        if (jwtPayload) {
          // Transform the JWT payload into your user object
          const user: User = {
            id: jwtPayload.sub!, // Assuming 'sub' is the user ID
            email: jwtPayload.email || '', // Replace with actual field from JWT payload
          };
          console.log('authorize ~ dynamic ~ user', user);
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
});
