import NextAuth, { type DefaultSession, type NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { validateJWT } from './lib/auth-helpers';

type User = {
  id: string;
  email: string;
};

declare module 'next-auth' {
  interface User {
    id?: string;
    // name?: string | null;
    email?: string | null;
    // image?: string | null;
  }

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
    signIn: '/start',
  },
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async jwt(jwtData) {
      // Available when trigger is "signIn" or "signUp".
      if (jwtData.user) {
        jwtData.token.customAttribute = '';
      }
      // console.log('auth ~ callback ~ jwt ~ jwtData 2', jwtData);
      return jwtData.token;
    },
    async session(sessionData) {
      if (sessionData.token) {
        sessionData.session.user.customAttribute = sessionData.token
          .customAttribute as string; // Transfer custom attributes to the session
      }
      // console.log('auth ~ callback ~ session ~ sessionData 2', sessionData);
      return sessionData.session;
    },
  },
  providers: [],
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
  debug: process.env.NODE_ENV === 'development',
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
      name: 'dynamicxyz',
      credentials: { token: { label: 'Token', type: 'password' } },
      async authorize(
        credentials: Partial<Record<'token', unknown>>,
      ): Promise<User | null> {
        const token = credentials.token as string;

        if (typeof token !== 'string' || !token) {
          throw new Error('Token is required as an string');
        }

        const jwtPayload = await validateJWT(token);

        if (jwtPayload) {
          // Transform the JWT payload into your user object
          const user: User = {
            id: jwtPayload.sub!, // Assuming 'sub' is the user ID
            email: (jwtPayload.email as string) ?? '', // Replace with actual field from JWT payload
          };
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
});
