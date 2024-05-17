'use client';

import { useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { IoMdArrowBack } from 'react-icons/io';

import { useDynamicContext } from '@/lib/dynamicxyz';
import shortenAddress from '@/utils/shortenAddress';

import Link from './Link';
import LoadingSkeleton from './LoadingSkeleton';
import Logo from './Logo';

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
  const router = useRouter();

  const showAccount = pathname !== '/start';
  const isPathWithLogo = pathsWithLogo.includes(pathname);
  const showLogo = isPathWithLogo || !primaryWallet;

  const currentPathTitle =
    pathTitles.find((path) => pathname.startsWith(path.prefix))?.title || '';

  const handleGoTo = useCallback(() => {
    const referrerStr =
      document.referrer !== '' ? document.referrer : window.location.href;
    const referrerUrl = new URL(referrerStr);
    if ([pathname, '/start'].includes(referrerUrl.pathname)) {
      router.push('/');
    } else {
      router.back();
    }
  }, [pathname, router]);

  return (
    <header className="h-16 w-full flex items-center justify-between bg-white dark:bg-slate-800 px-6">
      {showLogo ? (
        <Logo className="animate-bounce-from-bottom" />
      ) : (
        <div className="flex animate-bounce-from-bottom">
          <button
            type="button"
            className="text-3xl text-pink-500 transition active:scale-95"
            onClick={handleGoTo}
          >
            <IoMdArrowBack />
          </button>
          <span className="ml-3 text-2xl">{currentPathTitle}</span>
        </div>
      )}

      {showAccount &&
        (primaryWallet?.address ? (
          <Link
            href="/wallet"
            aria-label={primaryWallet.address}
            className="animate-bounce-from-bottom transition active:text-slate-300 active:scale-95"
          >
            {shortenAddress(primaryWallet.address, 3)}
          </Link>
        ) : (
          <div className="animate-bounce-from-bottom">
            <LoadingSkeleton className="w-24 h-6" />
          </div>
        ))}
    </header>
  );
}
