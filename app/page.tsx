'use client';

import HomeActions from '@/components/HomeActions';
import PageWrapper from '@/components/PageWrapper';

export default function App() {
  return (
    <PageWrapper id="page-app" requireSession={true}>
      <section className="flex flex-col space-y-8 justify-between sm:flex-row sm:space-y-0 sm:space-x-8">
        <HomeActions />
      </section>
    </PageWrapper>
  );
}
