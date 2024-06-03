'use client';

import { memo, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { IoMdArrowBack } from 'react-icons/io';

import useCopyToClipboard from '@/hooks/use-copy-to-clipboard';
import { useDynamicContext } from '@/lib/dynamicxyz';
import shortenAddress from '@/utils/shorten-address';

import LoadingSkeleton from './LoadingSkeleton';
import Logo from './Logo';

// List of paths that should have the logo on top left corner
// TODO: Find a better way to do this.
const pathsWithLogo = ['/', '/start'];

// List of paths and their titles to be displayed in the header when the user is on a path without logo.
// TODO: Find a better way to do this.
const pathTitles = [
  {
    prefix: '/payments',
    title: 'New Payment',
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

const Header = memo(function Header() {
  const { primaryWallet } = useDynamicContext();
  const { copyToClipboard } = useCopyToClipboard();
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
    <header className="flex h-16 w-full items-center justify-between bg-white px-6 dark:bg-slate-800">
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
          <button
            type="button"
            aria-label={primaryWallet.address}
            className="animate-bounce-from-bottom transition active:scale-95 active:text-slate-300"
            onClick={() => {
              if (pathname === '/wallet') {
                copyToClipboard(primaryWallet.address);
                toast.success('Address copied!');
              } else {
                router.push('/wallet');
              }
            }}
          >
            <span className="animate-background bg-gradient-to-r from-pink-400 via-indigo-400 to-cyan-400 bg-[length:_400%_400%] bg-clip-text text-transparent [animation-duration:_4s]">
              {shortenAddress(primaryWallet.address, 3)}
            </span>
          </button>
        ) : (
          <div className="animate-bounce-from-bottom">
            <LoadingSkeleton className="h-6 w-24" />
          </div>
        ))}
    </header>
  );
});

export default Header;
