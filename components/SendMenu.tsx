import { useState } from 'react';
import Image from 'next/image';
import { FaPix } from 'react-icons/fa6';

type SendType = 'crypto' | 'pix' | null;

export default function SendMenu() {
  const [sendType, setSendType] = useState<SendType>(null);

  return (
    <div className="safe-m-bottom">
      {sendType === null ? (
        <nav className="flex flex-col space-y-6 animate-bounce-from-bottom">
          <button
            type="button"
            className="py-2 text-left"
            onClick={() => {
              setSendType('crypto');
            }}
          >
            <div className="flex flex-row">
              <div className="flex items-center justify-center text-3xl">
                <Image
                  src="/images/networks/polygon.svg"
                  alt="Send using Crypto"
                  height={35}
                  width={35}
                  unoptimized={true}
                />
              </div>
              <div className="ml-4">
                <div className="text-xl">Send using Crypto</div>
                <div className="text-slate-400 font-light text-sm">
                  Send crypto assets to another account.
                </div>
              </div>
            </div>
          </button>

          <button
            type="button"
            className="py-2 text-left"
            onClick={() => {
              setSendType('pix');
            }}
          >
            <div className="flex flex-row">
              <div className="flex items-center justify-center text-3xl">
                <FaPix className="text-[#32BCAD]" />
              </div>
              <div className="ml-4">
                <div className="text-xl">Send using Pix</div>
                <div className="text-slate-400 font-light text-sm">
                  Send Reais using USDT from your account.
                </div>
              </div>
            </div>
          </button>
        </nav>
      ) : (
        <>
          <button
            type="button"
            className="flex items-center justify-center w-full p-4 mt-4 text-center cursor-pointer"
            onClick={() => setSendType(null)}
          >
            Close
          </button>
        </>
      )}
    </div>
  );
}
