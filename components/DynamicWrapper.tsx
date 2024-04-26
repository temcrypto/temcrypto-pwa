'use client';

import { type ReactNode, useCallback } from 'react';

import {
  DynamicContextProvider,
  EthereumWalletConnectors,
  ZeroDevSmartWalletConnectors,
  type UserProfile,
} from '@/lib/dynamicxyz';
import { getCsrfToken, signOut } from 'next-auth/react';

const DynamicProviderWrapper = ({ children }: { children: ReactNode }) => {
  // Memoize the handleAuthSuccess function
  const handleAuthSuccess = useCallback(
    async (args: { authToken: string; user: UserProfile }) => {
      const csrfToken = await getCsrfToken();

      // Send the authToken and CSRF token to the server-side API route
      await fetch('/api/auth/callback/credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ csrfToken, token: args.authToken }),
      })
        .then(async (res) => {
          if (res.ok) {
            window.location.href = '/';
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
    []
  );

  const handleOnLogout = useCallback(async () => {
    await signOut({ redirect: true, callbackUrl: '/start' });
  }, []);

  return (
    <DynamicContextProvider
      settings={{
        environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID!,
        walletConnectors: [
          EthereumWalletConnectors,
          ZeroDevSmartWalletConnectors,
        ],
        eventsCallbacks: {
          onAuthSuccess: handleAuthSuccess,
          onLogout: handleOnLogout,
        },
        shadowDOMEnabled: true,
      }}
      theme="auto"
    >
      {children}
    </DynamicContextProvider>
  );
};

export default DynamicProviderWrapper;
