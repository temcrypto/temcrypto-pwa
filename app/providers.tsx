import { type ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';

import { auth } from '@/auth';
import DynamicProviderWrapper from '@/components/dynamic-wrapper';
import { WalletProvider } from '@/context/wallet-context';

const Providers = async ({ children }: { children: ReactNode }) => {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <DynamicProviderWrapper>
        <WalletProvider>{children}</WalletProvider>
      </DynamicProviderWrapper>
    </SessionProvider>
  );
};

export default Providers;
