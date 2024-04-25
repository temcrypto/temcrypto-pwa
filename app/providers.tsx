'use client';

import { type ReactNode } from 'react';
import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';

import DynamicProviderWrapper from '@/components/DynamicWrapper';
import { PixPaymentProvider } from '@/context/PixPaymentContext';

type ProvidersProps = {
  children: ReactNode;
  session?: Session | null;
};

const Providers = ({ children, session }: ProvidersProps) => {
  return (
    <SessionProvider session={session}>
      <DynamicProviderWrapper>
        <PixPaymentProvider>{children}</PixPaymentProvider>
      </DynamicProviderWrapper>
    </SessionProvider>
  );
};

export default Providers;
