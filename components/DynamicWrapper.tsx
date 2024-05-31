'use client';

import { type ReactNode, useCallback } from 'react';
import { getCsrfToken, signOut } from 'next-auth/react';
import toast from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import {
  DynamicContextProvider,
  DynamicWagmiConnector,
  EthereumWalletConnectors,
  ZeroDevSmartWalletConnectors,
  locale,
  type UserProfile,
} from '@/lib/dynamicxyz';
import { wagmiConfig, WagmiProvider } from '@/lib/wagmi';

// Query Client configuration
const queryClient = new QueryClient();

const DynamicProviderWrapper = ({ children }: { children: ReactNode }) => {
  // Memoize the handleAuthSuccess function
  const handleAuthSuccess = useCallback(
    async (args: { authToken: string; user: UserProfile }) => {
      try {
        const csrfToken = await getCsrfToken();

        // Send the authToken and CSRF token to the server-side API route
        const res = await fetch('/api/auth/callback/credentials', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({ csrfToken, token: args.authToken }),
        });

        if (res.ok) {
          // If the user is already authenticated, we can just redirect them to their dashboard.
          window.location.href = '/';
        } else {
          // Handle any errors - maybe show an error message to the user
          const erroMessage = await res.text();
          console.error('Failed to authenticate user:', erroMessage);
          toast.error('Failed to authenticate user');
        }
      } catch (error) {
        // Handle any exceptions
        console.error('Login error in:', error);
        toast.error('An unexpected error occurred. Please try again later');
      }
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
        events: {
          onAuthSuccess: handleAuthSuccess,
          onLogout: handleOnLogout,
        },
        shadowDOMEnabled: true,
      }}
      theme="dark"
      locale={locale}
    >
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <DynamicWagmiConnector>{children}</DynamicWagmiConnector>
        </QueryClientProvider>
      </WagmiProvider>
    </DynamicContextProvider>
  );
};

export default DynamicProviderWrapper;
