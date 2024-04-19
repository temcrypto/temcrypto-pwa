import { type ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';

import {
  DynamicContextProvider,
  EthereumWalletConnectors,
  type UserProfile,
} from '@/lib/dynamicxyz';
import { getCsrfToken } from 'next-auth/react';

const DynamicProviderWrapper = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  // Memoize the handleAuthSuccess function
  const handleAuthSuccess = useCallback(
    async (args: { authToken: string; user: UserProfile }) => {
      console.log('handleAuthSuccess ~ args', args);

      const csrfToken = await getCsrfToken();

      // Send the authToken and CSRF token to the server-side API route
      await fetch('/api/auth/callback/credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ csrfToken, token: args.authToken }),
      })
        .then((res) => {
          if (res.ok) {
            console.log('LOGGED IN', res);
            if (args.user.newUser) {
              console.log('This is a new user');
            }

            router.push('/');
          } else {
            // Handle any errors - maybe show an error message to the user
            console.error('Failed to log in');
          }
        })
        .catch((error) => {
          // Handle any exceptions
          console.error('Error logging in', error);
        });
    },
    [router]
  );

  const handleOnLogout = useCallback(
    (args: any) => {
      console.log('onLogout was called', args);
      router.push('/signin');
    },
    [router]
  );

  return (
    <DynamicContextProvider
      settings={{
        environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID!,
        walletConnectors: [EthereumWalletConnectors],
        eventsCallbacks: {
          onAuthSuccess: handleAuthSuccess,
          onLogout: handleOnLogout,
        },
        logLevel: 'DEBUG',
        shadowDOMEnabled: true,
      }}
    >
      {children}
    </DynamicContextProvider>
  );
};

export default DynamicProviderWrapper;
