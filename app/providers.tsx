'use server';

import { type ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';

import DynamicProviderWrapper from '@/components/DynamicWrapper';
import { auth } from '@/auth';

const Providers = async ({ children }: { children: ReactNode }) => {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <DynamicProviderWrapper>{children}</DynamicProviderWrapper>
    </SessionProvider>
  );
};

export default Providers;
