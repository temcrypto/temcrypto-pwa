'use client';

import { type ReactNode } from 'react';

import DynamicProviderWrapper from '@/components/DynamicWrapper';

const Providers = ({ children }: { children: ReactNode }) => {
  return <DynamicProviderWrapper>{children}</DynamicProviderWrapper>;
};

export default Providers;
