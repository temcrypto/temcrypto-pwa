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
import PageWrapper from '@/components/PageWrapper';
import { useWalletContext } from '@/context/WalletContext';
import useCopyToClipboard from '@/hooks/useCopyToClipboard';
import { useDynamicContext, useEmbeddedReveal } from '@/lib/dynamicxyz';
import allowedTokensList from '@/utils/allowedTokens';
import shortenAddress from '@/utils/shortenAddress';
import TokenItem from '@/components/TokenItem';

// Define the prop types for the SectionHeader component
type SectionHeaderProps = {
  children: ReactNode;
};

// Memoize the SectionHeader component
const SectionHeader = memo(function SectionHeader({
  children,
}: SectionHeaderProps) {
  return (
    <h2 className="text-md text-slate-400 font-light uppercase">{children}</h2>
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
        <div className="flex flex-row justify-between items-center mb-3">
          <SectionHeader>Wallet</SectionHeader>
        </div>
        <div className="flex flex-col space-y-6 dark:text-white break-words">
          <div className="flex item-center">
            <Image
              src="/images/networks/polygon.svg"
              alt={userWalletAddress}
              height={20}
              width={20}
              className="inline me-2"
              unoptimized={true}
            />
            <button
              className="transition active:text-slate-300 active:scale-95"
              onClick={() => {
                copyToClipboard(userWalletAddress);
                toast.success('Address copied!');
              }}
            >
              {shortenAddress(userWalletAddress, 10)}
            </button>
          </div>

          {isEmailAccount && (
            <div className="flex item-center">
              <LuFileKey className="inline me-2 items-center text-rose-500 w-5 h-5" />
              <button
                className="transition active:text-slate-300 active:scale-95"
                onClick={() => initExportProcess()}
              >
                Export Key
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6">
        <div className="flex flex-row justify-between items-center mb-3">
          <SectionHeader>Connected with</SectionHeader>
        </div>
        <div className="flex flex-row justify-between dark:text-white">
          <div className="flex item-center">
            <Image
              src={`/images/sprite.svg#${userWalletType}`}
              alt={userAuthenticatedWith}
              height={20}
              width={20}
              className="inline me-2"
              unoptimized={true}
            />
            <button
              className={
                isEmailAccount
                  ? 'transition active:text-slate-300 active:scale-95'
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
            className="flex items-center text-rose-400 text-sm"
            onClick={() => handleLogOut()}
          >
            <IoMdLogOut className="inline me-1 w-4 h-4" />
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
  const [sheetOpen, setSheetOpen] = useState<WalletMenuType>(null);

  console.log('Wallet Page', userWalletAddress);

  return (
    <PageWrapper id="page-wallet" requireSession={true}>
      {userWalletAddress && (
        <>
          <div className="text-left">
            <div>
              <div className="flex p-4 text-left transition bg-slate-100 dark:bg-slate-700/60 rounded-3xl">
                <div className="flex flex-row w-full">
                  <div className="flex items-center justify-center text-4xl text-sky-500">
                    {/* <TbPigMoney /> */}
                    <TbWallet />
                  </div>
                  <div className="w-full ml-4">
                    <div className="flex flex-row items-center justify-between">
                      <div className="flex items-baseline">
                        <span className="text-4xl font-extrabold me-1 text-white">
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
                        className="text-amber-400 text-4xl font-extrabold active:scale-95"
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
              <div className="flex flex-row justify-between items-center mb-3">
                <SectionHeader>
                  Tokens
                  {/* <span className="ml-1">({tokensData.length})</span> */}
                </SectionHeader>
                <button
                  className="flex items-center transition active:scale-95"
                  onClick={() => setSheetOpen('wallet')}
                >
                  <BsThreeDots className="text-slate-400 w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col space-y-3 *:h-20">
                {allowedTokensList.map((token) => (
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
