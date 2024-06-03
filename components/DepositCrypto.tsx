import toast from 'react-hot-toast';
import { TbCopy } from 'react-icons/tb';
import { QRCodeSVG } from 'qrcode.react';

import useCopyToClipboard from '@/hooks/use-copy-to-clipboard';
import { useDynamicContext } from '@/lib/dynamicxyz';
import shortenAddress from '@/utils/shorten-address';

export default function DepositCrypto() {
  const { primaryWallet } = useDynamicContext();
  const { copyToClipboard } = useCopyToClipboard();

  return (
    <div className="flex animate-bounce-from-bottom flex-col items-center">
      {primaryWallet?.address && (
        <>
          <div className="mb-6 text-xl">Deposit Crypto</div>
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
            className="rounded-3xl border-8 border-pink-500 bg-white p-2 dark:bg-white"
          />

          <div className="mt-6">
            <button
              type="button"
              aria-label={primaryWallet.address}
              className="flex items-center text-lg transition active:scale-95 active:text-slate-300"
              onClick={() => {
                copyToClipboard(primaryWallet.address);
                toast.success('Address copied!');
              }}
            >
              <TbCopy className="mr-2 text-pink-500" />
              {shortenAddress(primaryWallet.address, 10)}
            </button>
          </div>

          <div className="mt-2 flex items-center">
            <p className="text-pretty text-center text-sm text-slate-400 transition">
              Only send Polygon assets to this account
            </p>
          </div>
        </>
      )}
    </div>
  );
}
