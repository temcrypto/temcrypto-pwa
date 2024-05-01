'use client';

import { type Address } from 'viem';

import HomeActions from '@/components/HomeActions';
import PageWrapper from '@/components/PageWrapper';
import TokenList from '@/components/TokenList';
import { useDynamicContext } from '@/lib/dynamicxyz';

export default function App() {
  const { primaryWallet } = useDynamicContext();

  return (
    <PageWrapper id="page-app" requireSession={true}>
      <section className="flex flex-col space-y-8 justify-between sm:flex-row sm:space-y-0 sm:space-x-8">
        <HomeActions />

        <div className="mt-6">
          <h1 className="text-lg font-extrabold">Tokens</h1>
          <TokenList address={primaryWallet?.address as Address} />
        </div>
      </section>
    </PageWrapper>
  );
}
