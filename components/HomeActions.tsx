/* eslint-disable @next/next/no-img-element */

import { useState } from 'react';
import { FaPix } from 'react-icons/fa6';
import Sheet from 'react-modal-sheet';

import DepositCrypto from './DepositCrypto';
import DepositPix from './DepositPix';

type DepositType = 'crypto' | 'pix' | null;

export default function HomeActions() {
  const [isSheetOpen, setSheetOpen] = useState<boolean>(false);
  const [depositType, setDepositType] = useState<DepositType>(null);

  return (
    <>
      <div className="flex rounded-2xl h-14 space-x-1 p-1 border-2 border-rose-500 text-center items-center">
        <div className="flex-1 rounded-l-xl transition active:scale-95">
          <button
            onClick={() => {
              setSheetOpen(true);
            }}
          >
            Pay
          </button>
        </div>
        <div className="flex-1 transition active:scale-95">
          <button
            onClick={() => {
              setSheetOpen(true);
            }}
          >
            Deposit
          </button>
        </div>
        <div className="flex-1 rounded-r-xl transition active:scale-95">
          <button
            onClick={() => {
              setSheetOpen(true);
            }}
          >
            Send
          </button>
        </div>
      </div>

      <Sheet
        isOpen={isSheetOpen}
        onClose={() => {
          setSheetOpen(false);
        }}
        detent="content-height"
        // rootId={sheetRootId}
      >
        <Sheet.Container>
          <Sheet.Header />
          <Sheet.Content>
            <>
              {depositType === 'crypto' && <DepositCrypto />}

              {depositType === 'pix' && <DepositPix />}

              {depositType !== null && (
                <button
                  type="button"
                  className="flex items-center justify-center w-full p-4 mt-4 text-center cursor-pointer"
                  onClick={() => setDepositType(null)}
                >
                  Cancel
                </button>
              )}
            </>

            {depositType === null && (
              <nav className="flex flex-col space-y-6 safe-m-bottom animate-bonce-from-bottom">
                <button
                  type="button"
                  className="py-2 text-left"
                  onClick={() => {
                    setDepositType('crypto');
                  }}
                >
                  <div className="flex flex-row">
                    <div className="flex items-center justify-center text-3xl">
                      <img
                        src={`https://iconic.dynamic-static-assets.com/icons/sprite.svg#polygon`}
                        alt="Deposit Crypto"
                        height={35}
                        width={35}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="">Deposit using Crypto</div>
                      <div className="text-slate-400 font-light text-sm">
                        Send crypto to your account.
                      </div>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  className="py-2 text-left"
                  onClick={() => {
                    setDepositType('pix');
                  }}
                >
                  <div className="flex flex-row">
                    <div className="flex items-center justify-center text-3xl">
                      <FaPix />
                    </div>
                    <div className="ml-4">
                      <div className="">Deposit using Pix</div>
                      <div className="text-slate-400 font-light text-sm">
                        Convert Reais to USDT in your account.
                      </div>
                    </div>
                  </div>
                </button>
              </nav>
            )}
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop onTap={() => setSheetOpen(false)} />
      </Sheet>
    </>
  );
}
