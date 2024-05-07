'use client';

import { usePathname } from 'next/navigation';
import { IoArrowBackOutline } from 'react-icons/io5';

import { useDynamicContext } from '@/lib/dynamicxyz';
import shortenAddress from '@/utils/shortenAddress';

import Link from './Link';
import Logo from './Logo';
import LoadingSkeleton from './LoadingSkeleton';

// List of paths that should have the logo on top left corner
// TODO: Find a better way to do this.
const pathsWithLogo = ['/', '/start'];

// List of paths and their titles to be displayed in the header when the user is on a path without logo.
// TODO: Find a better way to do this.
const pathTitles = [
  {
    prefix: '/send',
    title: 'Send Pix',
  },
  {
    prefix: '/receive',
    title: 'Receive Pix',
  },
  {
    prefix: '/wallet',
    title: 'My Wallet',
  },
  {
    prefix: '/txs',
    title: 'Transaction Details',
  },
];

export default function Header() {
  const { primaryWallet } = useDynamicContext();
  const pathname = usePathname();

  const showAccount = pathname !== '/start';
  const isPathWithLogo = pathsWithLogo.includes(pathname);
  const currentPathTitle =
    pathTitles.find((path) => pathname.startsWith(path.prefix))?.title || '';

  return (
    <header className="w-full flex animate-background bg-[length:_400%_400%] [animation-duration:_10s] bg-gradient-to-r from-pink-500 dark:from-pink-500/55 via-purple-300 dark:via-purple-300/55 to-cyan-300 dark:to-cyan-300/55 pb-0.5">
      <div className="h-16 w-full flex justify-between bg-white dark:bg-slate-800 px-6">
        <div className="flex items-center">
          {isPathWithLogo ? (
            <Logo className="animate-bounce-from-bottom" />
          ) : (
            <div className="flex animate-bounce-from-bottom">
              <button
                type="button"
                className="text-3xl text-pink-500 transition active:scale-95"
                onClick={() => {
                  history.back();
                }}
              >
                <IoArrowBackOutline />
              </button>
              <span className="ml-3 text-2xl">{currentPathTitle}</span>
            </div>
          )}
        </div>

        {showAccount && (
          <div className="flex items-center">
            {primaryWallet?.address ? (
              <Link
                href="/wallet"
                aria-label={primaryWallet.address}
                className="animate-bounce-from-bottom transition active:text-slate-300 active:scale-95"
              >
                {shortenAddress(primaryWallet.address, 3)}
              </Link>
            ) : (
              <div className="animate-bounce-from-bottom">
                <LoadingSkeleton className="w-24 h-5" />
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
