'use client';

import { memo, useState } from 'react';
import Link from 'next/link';
import {
  TbArrowDownFromArc,
  TbArrowDownToArc,
  TbCirclePlus,
  TbHistory,
  TbInvoice,
  TbPigMoney,
} from 'react-icons/tb';
import { Sheet } from 'react-modal-sheet';

import DepositMenu from '@/components/DepositMenu';
import PageWrapper from '@/components/page-wrapper';
import SendMenu from '@/components/SendMenu';
import { useWalletContext } from '@/context/wallet-context';
import LoadingSkeleton from '@/components/LoadingSkeleton';

type HomeMenuType = 'pay' | 'deposit' | 'send' | 'movements' | null;

const TotalBalance = memo(function TotalBalance() {
  const { baseCurrency, totalBalance } = useWalletContext();
  return (
    <div className="flex items-baseline">
      {totalBalance ? (
        <>
          <span className="me-1 text-4xl font-extrabold text-white">
            {totalBalance.toFixed(2)}
          </span>
          <span className="flex items-center text-slate-400">
            {baseCurrency}
          </span>
        </>
      ) : (
        <LoadingSkeleton className="h-8 w-32" />
      )}
    </div>
  );
});

export default function App() {
  const [sheetOpen, setSheetOpen] = useState<HomeMenuType>(null);

  return (
    <PageWrapper id="page-app" requireSession={true}>
      <section className="flex flex-col space-y-4">
        <div>
          <div className="flex min-h-20 w-full flex-row items-center rounded-3xl bg-slate-100 p-4 text-left dark:bg-slate-700/60">
            <div className="flex text-4xl text-sky-500">
              <TbPigMoney />
            </div>
            <div className="ml-4 flex-1">
              <TotalBalance />
            </div>

            <button
              type="button"
              className="text-4xl font-extrabold text-amber-400 active:scale-95"
              onClick={() => setSheetOpen('deposit')}
            >
              <TbCirclePlus />
            </button>
          </div>
        </div>

        <div>
          <div className="text-pretty px-2 py-4 text-left text-lg uppercase text-slate-400">
            Explore what to do...
          </div>

          <nav className="flex animate-bounce-from-bottom flex-col space-y-6 *:rounded-3xl *:bg-slate-100 *:p-4 *:text-left *:transition *:dark:bg-slate-700/60">
            <Link href="/payments">
              <div className="flex flex-row">
                <div className="flex items-center justify-center text-4xl text-rose-500">
                  <TbInvoice />
                </div>
                <div className="ml-4">
                  <div className="text-xl">Pay</div>
                  <div className="text-sm font-light text-slate-400">
                    Make a payment using your crypto wallet.
                  </div>
                </div>
              </div>
            </Link>

            <button
              type="button"
              className="active:scale-95"
              onClick={() => {
                setSheetOpen('deposit');
              }}
            >
              <div className="flex flex-row">
                <div className="flex items-center justify-center text-4xl text-green-500">
                  <TbArrowDownToArc />
                </div>
                <div className="ml-4">
                  <div className="text-xl">Receive</div>
                  <div className="text-sm font-light text-slate-400">
                    Receive payments in your account.
                  </div>
                </div>
              </div>
            </button>

            <button
              type="button"
              className="active:scale-95"
              onClick={() => {
                setSheetOpen('send');
              }}
            >
              <div className="flex flex-row">
                <div className="flex items-center justify-center text-4xl text-amber-500">
                  <TbArrowDownFromArc />
                </div>
                <div className="ml-4">
                  <div className="text-xl">Send</div>
                  <div className="text-sm font-light text-slate-400">
                    Send funds from your account to another.
                  </div>
                </div>
              </div>
            </button>

            <button
              type="button"
              className="active:scale-95"
              onClick={() => {
                setSheetOpen('movements');
              }}
            >
              <div className="flex flex-row">
                <div className="flex items-center justify-center text-4xl text-purple-500">
                  <TbHistory />
                </div>
                <div className="ml-4">
                  <div className="text-xl">Movements</div>
                  <div className="text-sm font-light text-slate-400">
                    Check your movements history and receipts.
                  </div>
                </div>
              </div>
            </button>
          </nav>
        </div>
      </section>

      <Sheet
        isOpen={!!sheetOpen}
        onClose={() => setSheetOpen(null)}
        detent="content-height"
      >
        <Sheet.Container>
          <Sheet.Header />
          <Sheet.Content>
            <div className="safe-m-bottom">
              {sheetOpen === 'deposit' && <DepositMenu />}
              {sheetOpen === 'send' && <SendMenu />}
            </div>
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop onTap={() => setSheetOpen(null)} />
      </Sheet>
    </PageWrapper>
  );
}
