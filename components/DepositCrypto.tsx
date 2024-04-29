/* eslint-disable @next/next/no-img-element */

import { TbCopy } from 'react-icons/tb';
import { QRCodeSVG } from 'qrcode.react';

import { useDynamicContext } from '@/lib/dynamicxyz';
import shortenAddress from '@/utils/shortenAddress';

export default function DepositCrypto() {
  const { primaryWallet } = useDynamicContext();

  return (
    <div className="flex flex-col items-center animate-bonce-from-bottom">
      {primaryWallet?.address && (
        <>
          <div className="text-xl mb-6">Deposit Crypto</div>
          <QRCodeSVG
            value={primaryWallet.address}
            size={250}
            bgColor={'#ffffff'}
            fgColor={'#1e293b'}
            level={'L'}
            includeMargin={false}
            imageSettings={{
              src: '/images/sprite.svg#polygon',
              x: undefined,
              y: undefined,
              height: 30,
              width: 30,
              excavate: true,
            }}
            className="rounded-2xl p-2 bg-white dark:bg-white border-8 border-pink-400"
          />

          <div className="flex items-center mt-6">
            <TbCopy className="text-pink-500 mr-2" />
            <button
              type="button"
              aria-label={primaryWallet.address}
              className="transition active:text-slate-300 active:scale-95"
            >
              {shortenAddress(primaryWallet.address, 10)}
            </button>
          </div>

          <div className="flex items-center mt-2">
            <p className="transition text-sm text-slate-400 active:scale-95 text-pretty text-center">
              Only send Polygon assets to this account
            </p>
          </div>
        </>
      )}
    </div>
  );
}
