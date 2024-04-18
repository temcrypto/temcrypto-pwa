import { type ReactNode, useCallback } from 'react';

import {
  DynamicContextProvider,
  EthereumWalletConnectors,
} from '@/lib/dynamicxyz';

const DynamicProviderWrapper = ({ children }: { children: ReactNode }) => {
  // Memoize the handleAuthSuccess function
  const handleAuthSuccess = useCallback(
    async (event: { authToken: string }) => {
      console.log('handleAuthSuccess ~ event', event);
    },
    []
  );

  const handleOnLogout = useCallback((args: any) => {
    console.log('onLogout was called', args);
  }, []);

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
