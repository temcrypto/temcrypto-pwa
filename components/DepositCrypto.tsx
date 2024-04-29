import { QRCodeSVG } from 'qrcode.react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import shortenAddress from '@/utils/shortenAddress';

export default function DepositCrypto() {
  const { primaryWallet } = useDynamicContext();

  return (
    <div className="flex flex-col items-center animate-bonce-from-bottom">
      {primaryWallet?.address && (
        <>
          <QRCodeSVG
            value={primaryWallet.address}
            size={200}
            bgColor={'#ffffff'}
            fgColor={'#1e293b'}
            level={'L'}
            includeMargin={false}
            imageSettings={{
              src: 'https://iconic.dynamic-static-assets.com/icons/sprite.svg#polygon',
              x: undefined,
              y: undefined,
              height: 24,
              width: 24,
              excavate: true,
            }}
            className="rounded-2xl p-2 bg-white"
          />

          <div className="mt-6">
            <button
              type="button"
              aria-label={primaryWallet.address}
              className="transition active:text-slate-300 active:scale-95"
            >
              {shortenAddress(primaryWallet.address, 10)}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
