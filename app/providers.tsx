// app/providers.tsx

import { type ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';

import { auth } from '@/auth';
import DynamicProviderWrapper from '@/components/DynamicWrapper';
import { PixPaymentProvider } from '@/context/PixPaymentContext';
import { RatesProvider } from '@/context/RatesContext';

import { fetchRates } from './actions';

const Providers = async ({ children }: { children: ReactNode }) => {
  const session = await auth();
  const rates = await fetchRates();

  return (
    <SessionProvider session={session}>
      <DynamicProviderWrapper>
        <RatesProvider rates={rates}>
          <PixPaymentProvider>{children}</PixPaymentProvider>
        </RatesProvider>
      </DynamicProviderWrapper>
    </SessionProvider>
  );
};

export default Providers;
