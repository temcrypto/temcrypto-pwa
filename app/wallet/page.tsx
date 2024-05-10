'use client';

import { memo, useEffect, useState, type ReactNode } from 'react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { BsThreeDots } from 'react-icons/bs';
import { IoMdLogOut } from 'react-icons/io';
import { IoAddCircleOutline } from 'react-icons/io5';
import { LuFileKey } from 'react-icons/lu';
import Sheet from 'react-modal-sheet';
import { type Address } from 'viem';

import DepositMenu from '@/components/DepositMenu';
import PageWrapper from '@/components/PageWrapper';
import TokensList from '@/components/TokensList';
import { useRates } from '@/context/RatesContext';
import useCopyToClipboard from '@/hooks/useCopyToClipboard';
import { useDynamicContext, useEmbeddedReveal } from '@/lib/dynamicxyz';
import { getTokensData, type TokenData } from '@/utils/getTokensData';
import shortenAddress from '@/utils/shortenAddress';

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

export default function Wallet() {
  const { primaryWallet, walletConnector } = useDynamicContext();
  const [tokensData, setTokensData] = useState<TokenData[]>([]);
  const [sheetOpen, setSheetOpen] = useState<WalletMenuType>(null);
  const [totalBalance, setTotalBalance] = useState<number>(0);
  const rates = useRates();

  // Set the wallet address to the user's primary wallet if they have one
  // Otherwise, set it to their email
  const userWalletAddress = (primaryWallet?.address ?? '0x00') as Address;

  // Move the fetchBalance logic to a separate effect
  useEffect(() => {
    const fetchBalance = async () => {
      if (userWalletAddress && walletConnector && rates) {
        try {
          const data = await getTokensData({
            address: userWalletAddress,
            walletConnector,
          });
          setTokensData(data ?? []);

          // Calculate the total balance using rates and data from tokenData. Show it in USDT format.
          const totalUsdt = data
            .map(({ symbol, balance }: TokenData) => {
              const rateObj = rates.find(({ code }) => code === symbol);
              if (rateObj) {
                return rateObj.value * parseFloat(balance);
              }
              return 0;
            })
            .reduce((acc: number, curr: number) => acc + curr, 0);

          setTotalBalance(totalUsdt);

          console.log(`Total balance: ${totalUsdt}`, data);
        } catch (err) {
          console.error('Error getting token balances:', err);
        }
      }
    };

    fetchBalance();
  }, [walletConnector, userWalletAddress, rates]);

  return (
    <PageWrapper id="page-wallet" requireSession={true}>
      {userWalletAddress && (
        <>
          <div className="text-left">
            <div>
              <div className="flex flex-row justify-end items-center mb-3">
                <button
                  className="flex items-center transition active:scale-95"
                  onClick={() => setSheetOpen('wallet')}
                >
                  <BsThreeDots className="text-slate-400 w-5 h-5" />
                </button>
              </div>
              <div className="flex items-baseline justify-center pb-4">
                <span className="text-4xl font-extrabold me-1 text-white">
                  {totalBalance.toFixed(2)}
                </span>

                <button
                  className="flex items-center text-slate-400 transition active:scale-95"
                  onClick={() => setSheetOpen('deposit')}
                >
                  USDT
                  {/* <IoChevronDownOutline className="inline me-1 w-4 h-4" /> */}
                </button>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex flex-row justify-between items-center mb-3">
                <SectionHeader>Tokens</SectionHeader>

                <button
                  className="flex items-center transition active:scale-95"
                  onClick={() => setSheetOpen('deposit')}
                >
                  <IoAddCircleOutline className="text-rose-500 inline me-1 w-5 h-5" />
                  Deposit
                </button>
              </div>
              <TokensList tokens={tokensData} />
            </div>
          </div>

          <Sheet
            isOpen={!!sheetOpen}
            onClose={() => setSheetOpen(null)}
            detent="content-height"
            // rootId={sheetRootId}
          >
            <Sheet.Container>
              <Sheet.Header />
              <Sheet.Content>
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
}
