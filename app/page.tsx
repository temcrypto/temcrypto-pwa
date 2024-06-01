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
import PageWrapper from '@/components/PageWrapper';
import PayMenu from '@/components/PayMenu';
import SendMenu from '@/components/SendMenu';
import { useWalletContext } from '@/context/WalletContext';
import LoadingSkeleton from '@/components/LoadingSkeleton';

type HomeMenuType = 'pay' | 'deposit' | 'send' | 'movements' | null;

const TotalBalance = memo(function TotalBalance() {
  const { baseCurrency, totalBalance } = useWalletContext();
  return (
    <div className="flex items-baseline">
      <span className="text-4xl font-extrabold me-1 text-white">
        {totalBalance ? (
          totalBalance.toFixed(2)
        ) : (
          <LoadingSkeleton className="h-6 w-24" />
        )}
      </span>
      <span className="flex items-center text-slate-400">
        {baseCurrency ?? ''}
      </span>
    </div>
  );
});

export default function App() {
  const [sheetOpen, setSheetOpen] = useState<HomeMenuType>(null);

  return (
    <PageWrapper id="page-app" requireSession={true}>
      <section className="flex flex-col space-y-4">
        <div>
          <div className="w-full flex flex-row items-center p-4 text-left bg-slate-100 dark:bg-slate-700/60 rounded-3xl">
            <div className="flex text-4xl text-sky-500">
              <TbPigMoney />
            </div>
            <div className="flex-1 ml-4">
              <TotalBalance />
            </div>

            <button
              type="button"
              className="text-amber-400 text-4xl font-extrabold active:scale-95"
              onClick={() => setSheetOpen('deposit')}
            >
              <TbCirclePlus />
            </button>
          </div>
        </div>

        <div>
          <div className="text-left text-lg text-slate-400 text-pretty px-2 py-4 uppercase">
            Explore what to do...
          </div>

          <nav className="flex flex-col space-y-6 animate-bounce-from-bottom *:p-4 *:text-left *:transition *:bg-slate-100 *:dark:bg-slate-700/60 *:rounded-3xl">
            <Link href="/payments">
              <div className="flex flex-row">
                <div className="flex items-center justify-center text-4xl text-rose-500">
                  <TbInvoice />
                </div>
                <div className="ml-4">
                  <div className="text-xl">Pay</div>
                  <div className="text-slate-400 font-light text-sm">
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
                  <div className="text-slate-400 font-light text-sm">
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
                  <div className="text-slate-400 font-light text-sm">
                    Send funds from your account to another.
                  </div>
                </div>
              </div>
            </button>

            <button
              type="button"
              className="active:scale-95"
              onClick={() => {
                setSheetOpen('pay');
              }}
            >
              <div className="flex flex-row">
                <div className="flex items-center justify-center text-4xl text-purple-500">
                  <TbHistory />
                </div>
                <div className="ml-4">
                  <div className="text-xl">Movements</div>
                  <div className="text-slate-400 font-light text-sm">
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
              {sheetOpen === 'pay' && <PayMenu />}
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
