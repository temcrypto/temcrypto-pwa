import { type ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';

import {
  DynamicContextProvider,
  EthereumWalletConnectors,
  UserProfile,
} from '@/lib/dynamicxyz';

const DynamicProviderWrapper = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  // Memoize the handleAuthSuccess function
  const handleAuthSuccess = useCallback(
    async (event: { authToken: string; user: UserProfile }) => {
      if (event.user.newUser) {
        console.log('This is a new user');
      }
      console.log('handleAuthSuccess ~ event', event);
      router.push('/');
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
