import { type ReactNode, useCallback } from 'react';
// import { getCsrfToken } from 'next-auth/react';
// import { RedirectType, redirect } from 'next/navigation';

import {
  DynamicContextProvider,
  EthereumWalletConnectors,
} from '@/lib/dynamicxyz';

const DynamicProviderWrapper = ({ children }: { children: ReactNode }) => {
  // Memoize the handleAuthSuccess function
  const handleAuthSuccess = useCallback(
    async (event: { authToken: string }) => {
      console.log(
        'handleAuthSuccess ~ event, authToken',
        event,
        event.authToken
      );
    },
    []
  );

  const handleOnLogout = useCallback((args: any) => {
    console.log('onLogout was called', args);
    // redirect('/', RedirectType.replace);
  }, []);

  //   const csrfToken = await getCsrfToken();

  //   // Send the authToken and CSRF token to the server-side API route
  //   await fetch('/api/auth/callback/credentials', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/x-www-form-urlencoded',
  //     },
  //     body: new URLSearchParams({ csrfToken, token: event.authToken }),
  //   })
  //     .then((res) => {
  //       if (res.ok) {
  //         console.log('LOGGED IN', res);
  //         redirect('/', RedirectType.replace);
  //       } else {
  //         // Handle any errors - maybe show an error message to the user
  //         console.error('Failed to log in');
  //       }
  //     })
  //     .catch((error) => {
  //       // Handle any exceptions
  //       console.error('Error logging in', error);
  //     });
  // },
  // [] // No dependencies, so the function will be memoized and only recreated if the component is re-mounted
  // );

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
