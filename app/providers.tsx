'use client';

import { type ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';

import DynamicProviderWrapper from '@/components/DynamicWrapper';

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <SessionProvider>
      <DynamicProviderWrapper>{children}</DynamicProviderWrapper>
    </SessionProvider>
  );
};

export default Providers;
