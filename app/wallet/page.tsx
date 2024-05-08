/* eslint-disable @next/next/no-img-element */

'use client';

import { memo, useState, type ReactNode } from 'react';
import toast from 'react-hot-toast';
import { IoIosAddCircleOutline, IoMdAdd, IoMdLogOut } from 'react-icons/io';
import { LuFileKey } from 'react-icons/lu';
import Sheet from 'react-modal-sheet';
import { type Address } from 'viem';

import PageWrapper from '@/components/PageWrapper';
import TokenList from '@/components/TokenList';
import useCopyToClipboard from '@/hooks/useCopyToClipboard';
import { useDynamicContext, useEmbeddedReveal } from '@/lib/dynamicxyz';
import shortenAddress from '@/utils/shortenAddress';
import DepositMenu from '@/components/DepositMenu';
import { IoAddCircleOutline } from 'react-icons/io5';

// Define the prop types for the PageHeader component
type PageHeaderProps = {
  children: ReactNode;
};

// Memoize the PageHeader component
const PageHeader = memo(function PageHeader({ children }: PageHeaderProps) {
  return (
    <h2 className="text-md text-slate-400 font-light uppercase">{children}</h2>
  );
});

export default function Wallet() {
  const { primaryWallet, user, handleLogOut } = useDynamicContext();
  const { copyToClipboard } = useCopyToClipboard();
  const { initExportProcess } = useEmbeddedReveal();
  const [sheetOpen, setSheetOpen] = useState(false);

  // Set the wallet address to the user's primary wallet if they have one
  // Otherwise, set it to their email
  const userWalletAddress = (primaryWallet?.address ?? '0x00') as Address;
  const userWalletType =
    (user?.isAuthenticatedWithAWallet ? user.wallet : 'signinwithemail') ?? '';
  const userAuthenticatedWith =
    (user?.isAuthenticatedWithAWallet
      ? user?.ens?.name ?? user.wallet
      : user?.email) ?? '';
  const canExportKey = userWalletType === 'signinwithemail';

  return (
    <PageWrapper id="page-wallet" requireSession={true}>
      {userWalletAddress && userWalletType && userAuthenticatedWith && (
        <div className="text-left">
          <div>
            <PageHeader>Connected with</PageHeader>
            <div className="flex flex-row justify-between dark:text-white">
              <div className="flex item-center">
                <img
                  src={`/images/sprite.svg#${userWalletType}`}
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

              <button
                className="flex items-center text-rose-500 text-sm"
                onClick={() => handleLogOut()}
              >
                <IoMdLogOut className="inline me-1 w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex flex-row justify-between items-center mb-3">
              <PageHeader>Wallet</PageHeader>
            </div>
            <div className="flex flex-col space-y-6 dark:text-white break-words">
              <div className="flex item-center">
                <img
                  src={`/images/networks/polygon.svg`}
                  alt={userWalletAddress}
                  height={20}
                  width={20}
                  className="inline me-2"
                />
                <button
                  onClick={() => {
                    copyToClipboard(userWalletAddress);
                    toast.success('Address copied!');
                  }}
                  className="transition active:text-slate-300 active:scale-95"
                >
                  {shortenAddress(userWalletAddress, 6)}
                </button>
              </div>

              {canExportKey && (
                <div className="flex item-center">
                  <LuFileKey className="inline me-2 items-center text-rose-500 w-5 h-5" />
                  <button onClick={() => initExportProcess()}>
                    Export Key
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6">
            <div className="flex flex-row justify-between items-center mb-3">
              <PageHeader>Tokens</PageHeader>

              <button
                className="flex items-center transition active:scale-95"
                onClick={() => setSheetOpen(true)}
              >
                <IoAddCircleOutline className="text-rose-500 inline me-1 w-5 h-5" />
                Deposit
              </button>
            </div>
            <TokenList address={userWalletAddress} />
          </div>
        </div>
      )}

      <Sheet
        isOpen={!!sheetOpen}
        onClose={() => setSheetOpen(false)}
        detent="content-height"
        // rootId={sheetRootId}
      >
        <Sheet.Container>
          <Sheet.Header />
          <Sheet.Content>
            <DepositMenu />
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop onTap={() => setSheetOpen(false)} />
      </Sheet>
    </PageWrapper>
  );
}
