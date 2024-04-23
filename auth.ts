import NextAuth, { type DefaultSession, type NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { validateJWT } from './lib/authHelpers';

type User = {
  id: string;
  email: string;
  ens?: any;
  wallet?: any;
};

// declare module 'next-auth' {
//   /**
//    * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
//    */
//   interface Session {
//     user: {
//       /** The user's postal address. */
//       address: string;
//       /**
//        * By default, TypeScript merges new interface properties and overwrites existing ones.
//        * In this case, the default session user properties will be overwritten,
//        * with the new ones defined above. To keep the default session user properties,
//        * you need to add them back into the newly declared interface.
//        */
//     } & DefaultSession['user'];
//   }
// }

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
    authorized(authorizedData) {
      console.log(
        'auth ~ callback ~ authorized ~ authorizedData',
        authorizedData
      );
      return true;
      // const isLoggedIn = !!auth?.user;
      // const isOnDashboardPage = nextUrl.pathname.startsWith('/');

      // if (isOnDashboardPage) {
      //   if (!isLoggedIn) return false;
      // } else if (isLoggedIn) {
      //   return Response.redirect(new URL('/', nextUrl));
      // }
    },
    async redirect(redirectData) {
      console.log('auth ~ callback ~ redirect ~ redirectData', redirectData);
      return redirectData.baseUrl;
    },
    async jwt(jwtData) {
      console.log('auth ~ callback ~ jwt ~ jwtData', jwtData);
      return jwtData.token;
    },
    async session(sessionData) {
      console.log('auth ~ callback ~ session ~ sessionData', sessionData);
      return sessionData.session;
    },
  },
  events: {
    async signIn(message) {
      /* on successful sign in */
      console.log('auth ~ events ~ signIn ~ message', message);
    },
    async signOut(message) {
      /* on signout */
      console.log('auth ~ events ~ signOut ~ message', message);
    },
    async createUser(message) {
      /* user created */
      console.log('auth ~ events ~ createUser ~ message', message);
    },
    async updateUser(message) {
      /* user updated - e.g. their email was verified */
      console.log('auth ~ events ~ updateUser ~ message', message);
    },
    async linkAccount(message) {
      /* account (e.g. Twitter) linked to a user */
      console.log('auth ~ events ~ linkAccount ~ message', message);
    },
    async session(message) {
      /* session is active */
      console.log('auth ~ events ~ session ~ message', message);
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
        console.log('jwPayload', jwtPayload);

        if (jwtPayload) {
          // Transform the JWT payload into your user object
          const user: User = {
            id: jwtPayload.sub!, // Assuming 'sub' is the user ID
            email: jwtPayload.email || '', // Replace with actual field from JWT payload
            wallet:
              jwtPayload.verified_credentials[0].wallet_name ??
              jwtPayload.verified_credentials[0].address,
          };
          console.log('auth ~ user', user);
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
});
