import { type ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';

import { auth } from '@/auth';
import DynamicProviderWrapper from '@/components/DynamicWrapper';
import { PixPaymentProvider } from '@/context/PixPaymentContext';

const Providers = async ({ children }: { children: ReactNode }) => {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <DynamicProviderWrapper>
        <PixPaymentProvider>{children}</PixPaymentProvider>
      </DynamicProviderWrapper>
    </SessionProvider>
  );
};

export default Providers;
