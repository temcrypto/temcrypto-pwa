'use client';

import Link from 'next/link';
import { IoIosArrowForward } from 'react-icons/io';
import { TbPigMoney } from 'react-icons/tb';

import HomeActions from '@/components/HomeActions';
import PageWrapper from '@/components/PageWrapper';

export default function App() {
  return (
    <PageWrapper id="page-app" requireSession={true}>
      <section className="flex flex-col space-y-6">
        <div>
          <Link
            href="/wallet"
            className="flex active:scale-95 p-4 text-left transition bg-slate-100 dark:bg-slate-700/60 rounded-3xl"
          >
            <div className="w-full flex flex-row items-center">
              <div className="flex text-4xl text-sky-500">
                <TbPigMoney />
              </div>
              <div className="flex-1 ml-4">
                <div className="text-xl">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-extrabold me-1 text-white">
                      {(15.89).toFixed(2)}
                    </span>
                    <span className="flex items-center text-slate-400 transition active:scale-95">
                      USDT
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center pl-2 text-slate-400 text-extrabold text-2xl">
                <IoIosArrowForward />
              </div>
            </div>
          </Link>
        </div>

        <HomeActions />
      </section>
    </PageWrapper>
  );
}
