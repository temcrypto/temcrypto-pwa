'use client';

import HomeActions from '@/components/HomeActions';
import PageWrapper from '@/components/PageWrapper';
import TokenList from '@/components/TokenList';

export default function App() {
  return (
    <PageWrapper id="page-app">
      <section className="flex flex-col space-y-8 justify-between sm:flex-row sm:space-y-0 sm:space-x-8">
        <HomeActions />

        <div className="mt-6">
          <h1 className="text-lg font-extrabold">
            Tokens
            <span className="font-normal text-slate-500 ml-2">(2)</span>
          </h1>
          <TokenList />
        </div>
      </section>
    </PageWrapper>
  );
}
