import { type ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';

import { auth } from '@/auth';
import DynamicProviderWrapper from '@/components/DynamicWrapper';
import { PixPaymentProvider } from '@/context/PixPaymentContext';

const Providers = async ({ children }: { children: ReactNode }) => {
  const session = await auth();
  console.log('Provider ~ session', session);

  return (
    <DynamicProviderWrapper>
      <SessionProvider session={session}>
        <PixPaymentProvider>{children}</PixPaymentProvider>
      </SessionProvider>
    </DynamicProviderWrapper>
  );
};

export default Providers;
