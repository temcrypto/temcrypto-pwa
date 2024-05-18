/* eslint-disable @next/next/no-img-element */

import { useState } from 'react';
// import Image from 'next/image';
import { FaPix } from 'react-icons/fa6';

import PayPix from './PayPix';

type PayType = 'crypto' | 'pix' | null;

export default function PayMenu() {
  const [payType, setPayType] = useState<PayType>(null);

  return (
    <>
      {payType === null ? (
        <nav className="flex flex-col space-y-6 animate-bounce-from-bottom">
          <button
            type="button"
            className="py-2 text-left"
            onClick={() => {
              setPayType('crypto');
            }}
          >
            <div className="flex flex-row">
              <div className="flex items-center justify-center text-3xl">
                <img
                  src="/images/networks/polygon.svg"
                  alt="Pay using Crypto"
                  height={35}
                  width={35}
                />
              </div>
              <div className="ml-4">
                <div className="text-xl">Pay using Crypto</div>
                <div className="text-slate-400 font-light text-sm">
                  Spend crypto assets from your account.
                </div>
              </div>
            </div>
          </button>

          <button
            type="button"
            className="py-2 text-left"
            onClick={() => {
              setPayType('pix');
            }}
          >
            <div className="flex flex-row">
              <div className="flex items-center justify-center text-3xl">
                <FaPix className="text-[#32BCAD]" />
              </div>
              <div className="ml-4">
                <div className="text-xl">Pay using Pix</div>
                <div className="text-slate-400 font-light text-sm">
                  Pay Reais using USDT from your account.
                </div>
              </div>
            </div>
          </button>
        </nav>
      ) : (
        <>
          {payType === 'pix' && <PayPix />}

          <button
            type="button"
            className="flex items-center justify-center w-full p-4 mt-4 text-center cursor-pointer"
            onClick={() => setPayType(null)}
          >
            Close
          </button>
        </>
      )}
    </>
  );
}
