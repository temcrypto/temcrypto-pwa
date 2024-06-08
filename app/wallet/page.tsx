'use client';

import { memo, useState, type ReactNode } from 'react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { BsThreeDots } from 'react-icons/bs';
import { IoMdLogOut } from 'react-icons/io';
import { LuFileKey } from 'react-icons/lu';
import { TbCirclePlus, TbWallet } from 'react-icons/tb';
import { Sheet } from 'react-modal-sheet';
import { type Address } from 'viem';

import DepositMenu from '@/components/DepositMenu';
import TokenItem from '@/components/TokenItem';
import PageWrapper from '@/components/page-wrapper';
import { useWalletContext } from '@/context/wallet-context';
import useCopyToClipboard from '@/hooks/use-copy-to-clipboard';
import { useDynamicContext, useEmbeddedReveal } from '@/lib/dynamicxyz';
import shortenAddress from '@/utils/shorten-address';
import supportedTokensList from '@/utils/token-list';

// Define the prop types for the SectionHeader component
type SectionHeaderProps = {
  children: ReactNode;
};

// Memoize the SectionHeader component
const SectionHeader = memo(function SectionHeader({
  children,
}: SectionHeaderProps) {
  return (
    <h2 className="text-md font-light uppercase text-slate-400">{children}</h2>
  );
});

const WalletDetailsMenu = memo(function WalletDetailsMenu() {
  const { handleLogOut, primaryWallet, user } = useDynamicContext();
  const { copyToClipboard } = useCopyToClipboard();
  const { initExportProcess } = useEmbeddedReveal();

  // Set the wallet address to the user's primary wallet if they have one
  // Otherwise, set it to their email
  const userWalletAddress = (primaryWallet?.address ?? '0x00') as Address;
  const userAuthenticatedWith =
    (user?.isAuthenticatedWithAWallet
      ? user?.ens?.name ?? user.wallet
      : user?.email) ?? '';
  const userWalletType =
    (user?.isAuthenticatedWithAWallet ? user.wallet : 'signinwithemail') ?? '';
  const isEmailAccount = userWalletType === 'signinwithemail';

  return (
    <>
      <div>
        <div className="mb-3 flex flex-row items-center justify-between">
          <SectionHeader>Wallet</SectionHeader>
        </div>
        <div className="flex flex-col space-y-6 break-words dark:text-white">
          <div className="item-center flex">
            <Image
              src="/images/networks/polygon.svg"
              alt={userWalletAddress}
              height={20}
              width={20}
              className="me-2 inline"
            />
            <button
              className="transition active:scale-95 active:text-slate-300"
              onClick={() => {
                copyToClipboard(userWalletAddress);
                toast.success('Address copied!');
              }}
            >
              {shortenAddress(userWalletAddress, 10)}
            </button>
          </div>

          {isEmailAccount && (
            <div className="item-center flex">
              <LuFileKey className="me-2 inline h-5 w-5 items-center text-rose-500" />
              <button
                className="transition active:scale-95 active:text-slate-300"
                onClick={() => initExportProcess()}
              >
                Export Key
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-3 flex flex-row items-center justify-between">
          <SectionHeader>Connected with</SectionHeader>
        </div>
        <div className="flex flex-row justify-between dark:text-white">
          <div className="item-center flex">
            <Image
              src={`/images/sprite.svg#${userWalletType}`}
              alt={userAuthenticatedWith}
              height={20}
              width={20}
              className="me-2 inline"
              unoptimized={true}
            />
            <button
              className={
                isEmailAccount
                  ? 'transition active:scale-95 active:text-slate-300'
                  : ''
              }
              onClick={() => {
                if (isEmailAccount) {
                  copyToClipboard(userAuthenticatedWith);
                  toast.success('Email copied!');
                }
              }}
            >
              {userAuthenticatedWith}
            </button>
          </div>

          <button
            className="flex items-center text-sm text-rose-400"
            onClick={() => handleLogOut()}
          >
            <IoMdLogOut className="me-1 inline h-4 w-4" />
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
});

type WalletMenuType = 'deposit' | 'wallet' | null;

const WalletPage = memo(function Wallet() {
  const {
    userAddress: userWalletAddress,
    baseCurrency,
    totalBalance,
  } = useWalletContext();
  const {
    primaryWallet,
    user,
    authToken,
    isAuthenticated,
    loadingNetwork,
    bridgeChainsToConnect,
  } = useDynamicContext();
  const [sheetOpen, setSheetOpen] = useState<WalletMenuType>(null);

  console.log('Wallet Page', userWalletAddress);

  return (
    <PageWrapper id="page-wallet" requireSession={true}>
      {userWalletAddress && (
        <>
          <div className="text-left">
            <div>
              <div className="flex min-h-20 rounded-3xl bg-slate-100 p-4 text-left transition dark:bg-slate-700/60">
                <div className="flex w-full flex-row items-center">
                  <div className="flex items-center justify-center text-4xl text-sky-500">
                    <TbWallet />
                  </div>
                  <div className="ml-4 w-full">
                    <div className="flex flex-row items-center justify-between">
                      <div className="flex items-baseline">
                        <span className="me-1 text-4xl font-extrabold text-white">
                          {totalBalance.toFixed(2)}
                        </span>
                        <button
                          className="flex items-center text-slate-400"
                          // className="flex items-center text-slate-400 transition active:scale-95"
                          // onClick={() => setSheetOpen('deposit')}
                        >
                          {baseCurrency}
                          {/* <IoChevronDownOutline className="inline me-1 w-4 h-4" /> */}
                        </button>
                      </div>

                      <button
                        type="button"
                        className="text-4xl font-extrabold text-amber-400 active:scale-95"
                        onClick={() => setSheetOpen('deposit')}
                      >
                        <TbCirclePlus />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="mb-3 flex flex-row items-center justify-between">
                <SectionHeader>Tokens</SectionHeader>
                <button
                  className="flex items-center transition active:scale-95"
                  onClick={() => setSheetOpen('wallet')}
                >
                  <BsThreeDots className="h-5 w-5 text-slate-400" />
                </button>
              </div>

              <div className="flex flex-col space-y-3 *:h-20">
                {supportedTokensList.map((token) => (
                  <TokenItem key={token.address} token={token} />
                ))}
              </div>
            </div>
          </div>

          <Sheet
            isOpen={!!sheetOpen}
            onClose={() => setSheetOpen(null)}
            detent="content-height"
          >
            <Sheet.Container>
              <Sheet.Header />
              <Sheet.Content className="safe-m-bottom">
                {sheetOpen === 'deposit' && <DepositMenu />}
                {sheetOpen === 'wallet' && <WalletDetailsMenu />}
              </Sheet.Content>
            </Sheet.Container>
            <Sheet.Backdrop onTap={() => setSheetOpen(null)} />
          </Sheet>
        </>
      )}
    </PageWrapper>
  );
});

export default WalletPage;
