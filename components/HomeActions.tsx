import { useState } from 'react';
import {
  TbArrowDownFromArc,
  TbArrowDownToArc,
  TbInvoice,
} from 'react-icons/tb';
import Sheet from 'react-modal-sheet';

import DepositMenu from './DepositMenu';
import SendMenu from './SendMenu';
import PayMenu from './PayMenu';

type HomeMenuType = 'pay' | 'deposit' | 'send' | null;

export default function HomeActions() {
  const [sheetOpen, setSheetOpen] = useState<HomeMenuType>(null);

  return (
    <>
      <div>
        <div className="text-center text-3xl text-slate-400 text-pretty text-transparent animate-background bg-[length:_400%_400%] [animation-duration:_4s] bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-pink-400 px-4 py-10">
          Start exploring what you can do with us
        </div>

        <nav className="mt-8 flex flex-col space-y-6 safe-m-bottom animate-bounce-from-bottom *:bg-slate-100 *:dark:bg-slate-700 *:rounded-3xl *:p-4">
          <button
            type="button"
            className="py-2 text-left"
            onClick={() => {
              setSheetOpen('pay');
            }}
          >
            <div className="flex flex-row">
              <div className="flex items-center justify-center text-4xl text-pink-500">
                <TbInvoice />
              </div>
              <div className="ml-4">
                <div className="text-xl">Pay</div>
                <div className="text-slate-400 font-light text-sm">
                  Make a payment using your crypto wallet.
                </div>
              </div>
            </div>
          </button>

          <button
            type="button"
            className="py-2 text-left"
            onClick={() => {
              setSheetOpen('deposit');
            }}
          >
            <div className="flex flex-row">
              <div className="flex items-center justify-center text-4xl text-pink-500">
                <TbArrowDownToArc />
              </div>
              <div className="ml-4">
                <div className="text-xl">Deposit</div>
                <div className="text-slate-400 font-light text-sm">
                  Deposit funds in your account to operate.
                </div>
              </div>
            </div>
          </button>

          <button
            type="button"
            className="py-2 text-left"
            onClick={() => {
              setSheetOpen('send');
            }}
          >
            <div className="flex flex-row">
              <div className="flex items-center justify-center text-4xl text-pink-500">
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
        </nav>
      </div>

      <Sheet
        isOpen={!!sheetOpen}
        onClose={() => setSheetOpen(null)}
        detent="content-height"
        // rootId={sheetRootId}
      >
        <Sheet.Container>
          <Sheet.Header />
          <Sheet.Content>
            {sheetOpen === 'pay' && <PayMenu />}
            {sheetOpen === 'deposit' && <DepositMenu />}
            {sheetOpen === 'send' && <SendMenu />}
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop onTap={() => setSheetOpen(null)} />
      </Sheet>
    </>
  );
}
