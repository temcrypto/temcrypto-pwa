import { useState } from 'react';
import Image from 'next/image';
import { FaPix } from 'react-icons/fa6';

import DepositCrypto from './DepositCrypto';
import DepositPix from './DepositPix';

type DepositType = 'crypto' | 'pix' | null;

export default function DepositMenu() {
  const [depositType, setDepositType] = useState<DepositType>(null);

  return (
    <>
      {depositType === null ? (
        <nav className="flex animate-bounce-from-bottom flex-col space-y-6">
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
                  alt="Deposit using Crypto"
                  height={36}
                  width={36}
                />
              </div>
              <div className="ml-4">
                <div className="text-xl">Deposit using Crypto</div>
                <div className="text-sm font-light text-slate-400">
                  Receive crypto assets in your account.
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
                <FaPix className="h-9 w-9 rounded-full bg-white p-[5px] text-[#32BCAD]" />
              </div>
              <div className="ml-4">
                <div className="text-xl">Deposit using Pix</div>
                <div className="text-sm font-light text-slate-400">
                  Convert Reais to USDT in your account.
                </div>
              </div>
            </div>
          </button>
        </nav>
      ) : (
        <>
          {depositType === 'crypto' && <DepositCrypto />}
          {depositType === 'pix' && <DepositPix />}

          <button
            type="button"
            className="mt-4 flex w-full cursor-pointer items-center justify-center p-4 text-center"
            onClick={() => setDepositType(null)}
          >
            Close
          </button>
        </>
      )}
    </>
  );
}
