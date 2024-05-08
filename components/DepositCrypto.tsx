/* eslint-disable @next/next/no-img-element */

import toast from 'react-hot-toast';
import { TbCopy } from 'react-icons/tb';
import { QRCodeSVG } from 'qrcode.react';

import useCopyToClipboard from '@/hooks/useCopyToClipboard';
import { useDynamicContext } from '@/lib/dynamicxyz';
import shortenAddress from '@/utils/shortenAddress';

export default function DepositCrypto() {
  const { primaryWallet } = useDynamicContext();
  const { copyToClipboard } = useCopyToClipboard();

  return (
    <div className="flex flex-col items-center animate-bounce-from-bottom">
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
              src: '/images/networks/polygon.svg',
              x: undefined,
              y: undefined,
              height: 40,
              width: 40,
              excavate: true,
            }}
            className="rounded-3xl p-2 bg-white dark:bg-white border-8 border-pink-500"
          />

          <div className="mt-6">
            <button
              type="button"
              aria-label={primaryWallet.address}
              className="flex items-center text-lg transition active:text-slate-300 active:scale-95"
              onClick={() => {
                copyToClipboard(primaryWallet.address);
                toast.success('Address copied!');
              }}
            >
              <TbCopy className="text-pink-500 mr-2" />
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
