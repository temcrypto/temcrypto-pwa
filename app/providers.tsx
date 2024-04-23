'use client';

import { type ReactNode } from 'react';
import { SessionProvider, useSession } from 'next-auth/react';

import DynamicProviderWrapper from '@/components/DynamicWrapper';

const Providers = ({ children }: { children: ReactNode }) => {
  const { data: session } = useSession();

  return (
    <SessionProvider session={session}>
      <DynamicProviderWrapper>{children}</DynamicProviderWrapper>
    </SessionProvider>
  );
};

export default Providers;
