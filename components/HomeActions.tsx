/* eslint-disable @next/next/no-img-element */

import { useState } from 'react';
import Sheet from 'react-modal-sheet';

import DepositMenu from './DepositMenu';

type HomeActionType = 'pay' | 'deposit' | 'send' | null;

export default function HomeActions() {
  const [sheetOpen, setSheetOpen] = useState<HomeActionType>(null);

  return (
    <>
      <div className="flex rounded-2xl h-14 space-x-1 p-1 border-2 border-rose-500 text-center items-center">
        <div className="flex-1 rounded-l-xl transition active:scale-95">
          <button
            onClick={() => {
              setSheetOpen('pay');
            }}
          >
            Pay
          </button>
        </div>
        <div className="flex-1 transition active:scale-95">
          <button
            onClick={() => {
              setSheetOpen('deposit');
            }}
          >
            Deposit
          </button>
        </div>
        <div className="flex-1 rounded-r-xl transition active:scale-95">
          <button
            onClick={() => {
              setSheetOpen('send');
            }}
          >
            Send
          </button>
        </div>
      </div>

      <Sheet
        isOpen={!!sheetOpen}
        onClose={() => {
          setSheetOpen(null);
        }}
        detent="content-height"
        // rootId={sheetRootId}
      >
        <Sheet.Container>
          <Sheet.Header />
          <Sheet.Content>
            {sheetOpen === 'deposit' && <DepositMenu />}
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop onTap={() => setSheetOpen(null)} />
      </Sheet>
    </>
  );
}
