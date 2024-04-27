/* eslint-disable @next/next/no-img-element */

'use client';

import toast from 'react-hot-toast';
import { LuFileKey } from 'react-icons/lu';

import PageWrapper from '@/components/PageWrapper';
import useCopyToClipboard from '@/hooks/useCopyToClipboard';
import { useDynamicContext, useEmbeddedReveal } from '@/lib/dynamicxyz';
import shortenAddress from '@/utils/shortenAddress';

export default function Wallet() {
  const { primaryWallet, user, handleLogOut } = useDynamicContext();
  const { copyToClipboard } = useCopyToClipboard();
  const { initExportProcess } = useEmbeddedReveal();

  // Set the wallet address to the user's primary wallet if they have one
  // Otherwise, set it to their email
  const userWallet = primaryWallet?.address ?? '';
  const userWalletType =
    (user?.isAuthenticatedWithAWallet ? user.wallet : 'signinwithemail') ?? '';
  const userAuthenticatedWith =
    (user?.isAuthenticatedWithAWallet
      ? user?.ens?.name ?? user.wallet
      : user?.email) ?? '';

  return (
    <PageWrapper id="page-wallet" requireSession={true}>
      {userWallet && userWalletType && userAuthenticatedWith && (
        <div className="text-left">
          <div className="text-md text-slate-400 font-light uppercase mb-3">
            Wallet
          </div>
          <div className="flex flex-col space-y-6 dark:text-white break-words">
            <div className="flex item-center">
              <img
                src={`https://iconic.dynamic-static-assets.com/icons/sprite.svg#polygon`}
                alt={userWallet}
                height={20}
                width={20}
                className="inline me-2"
              />
              <button
                onClick={() => {
                  copyToClipboard(userWallet);
                  toast.success('Address copied!');
                }}
                className="transition active:text-slate-300 active:scale-95"
              >
                {shortenAddress(userWallet)}
              </button>
            </div>

            <div className="flex item-center">
              <LuFileKey className="inline me-2 items-center text-rose-500 w-5 h-5" />
              <button onClick={() => initExportProcess()}>Export</button>
            </div>
          </div>

          <div className="text-md text-slate-400 font-light uppercase mb-3 mt-6">
            Connected with
          </div>
          <div className="flex dark:text-white break-words items-center">
            <img
              src={`https://iconic.dynamic-static-assets.com/icons/sprite.svg#${userWalletType}`}
              alt={userAuthenticatedWith}
              height={20}
              width={20}
              className="inline me-2"
            />
            <button
              onClick={() => {
                copyToClipboard(userAuthenticatedWith);
                toast.success('Copied!');
              }}
              className="transition active:text-slate-300 active:scale-95"
            >
              {userAuthenticatedWith}
            </button>
          </div>

          <div className="text-md text-slate-400 font-light uppercase mb-3 mt-6">
            Session
          </div>
          <div className="dark:text-white break-words">
            <button
              className="text-red-400 uppercase"
              onClick={() => handleLogOut()}
            >
              Signout
            </button>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}
