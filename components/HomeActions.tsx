import { useRef, useState } from 'react';
import {
  TbArrowDownFromArc,
  TbArrowDownToArc,
  TbInvoice,
} from 'react-icons/tb';
import { Sheet, type SheetRef } from 'react-modal-sheet';

import useAnimatedVirtualKeyboard from '@/hooks/useAnimatedVirtualKeyboard';

import DepositMenu from './DepositMenu';
import SendMenu from './SendMenu';
import PayMenu from './PayMenu';

type HomeMenuType = 'pay' | 'deposit' | 'send' | null;

export default function HomeActions() {
  const [sheetOpen, setSheetOpen] = useState<HomeMenuType>(null);

  const sheetRef = useRef<SheetRef>();

  const { keyboardHeight } = useAnimatedVirtualKeyboard();

  return (
    <>
      <div>
        <div className="text-left text-3xl text-slate-400 text-pretty text-transparent animate-background bg-[length:_400%_400%] [animation-duration:_4s] bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-pink-400 px-4 py-10">
          Start exploring what you can do with us...
        </div>

        <nav className="mt-8 flex flex-col space-y-6 safe-m-bottom animate-bounce-from-bottom *:p-4 *:text-left *:transition *:bg-slate-100 *:dark:bg-slate-700/60 *:rounded-3xl">
          <button
            type="button"
            className="active:scale-95"
            onClick={() => {
              setSheetOpen('pay');
            }}
          >
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
          </button>

          <button
            type="button"
            className="active:scale-95"
            onClick={() => {
              setSheetOpen('deposit');
            }}
          >
            <div className="flex flex-row">
              <div className="flex items-center justify-center text-4xl text-cyan-500">
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
        </nav>
      </div>

      <Sheet
        ref={sheetRef}
        isOpen={!!sheetOpen}
        onClose={() => setSheetOpen(null)}
        detent="content-height"
      >
        <Sheet.Container>
          <Sheet.Header />
          <Sheet.Content style={{ marginBottom: keyboardHeight }}>
            <div className="safe-m-bottom">
              {sheetOpen === 'pay' && <PayMenu />}
              {sheetOpen === 'deposit' && <DepositMenu />}
              {sheetOpen === 'send' && <SendMenu />}
            </div>
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop onTap={() => setSheetOpen(null)} />
      </Sheet>
    </>
  );
}
