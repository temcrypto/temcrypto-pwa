/* eslint-disable @next/next/no-img-element */

import { useState } from 'react';
import { FaPix } from 'react-icons/fa6';

import DepositCrypto from './DepositCrypto';
import DepositPix from './DepositPix';
import Image from 'next/image';

type DepositType = 'crypto' | 'pix' | null;

export default function DepositMenu() {
  const [depositType, setDepositType] = useState<DepositType>(null);

  return (
    <>
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
                <Image
                  src="/images/networks/polygon.svg"
                  alt="Deposit Crypto"
                  height={35}
                  width={35}
                />
              </div>
              <div className="ml-4">
                <div className="text-xl">Deposit using Crypto</div>
                <div className="text-slate-400 font-light text-sm">
                  Send crypto assets to your account.
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
                <FaPix className="text-[#32BCAD]" />
              </div>
              <div className="ml-4">
                <div className="text-xl">Deposit using Pix</div>
                <div className="text-slate-400 font-light text-sm">
                  Convert Reais to USDT in your account.
                </div>
              </div>
            </div>
          </button>
        </nav>
      )}
    </>
  );
}
