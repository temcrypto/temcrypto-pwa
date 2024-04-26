'use client';

import { usePathname } from 'next/navigation';
import toast from 'react-hot-toast';
import { IoArrowBackOutline } from 'react-icons/io5';

import useCopyToClipboard from '@/hooks/useCopyToClipboard';
import { useDynamicContext } from '@/lib/dynamicxyz';
import shortenAddress from '@/utils/shortenAddress';

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
  const { copyToClipboard } = useCopyToClipboard();

  const isPathWithLogo = pathsWithLogo.includes(pathname);

  console.log('Header', isPathWithLogo, primaryWallet);

  return (
    <header className="w-full flex animate-background bg-[length:_400%_400%] [animation-duration:_10s] bg-gradient-to-r from-pink-500 dark:from-pink-500/55 via-purple-300 dark:via-purple-300/55 to-cyan-300 dark:to-cyan-300/55 pb-0.5">
      <div className="h-16 w-full flex justify-between bg-white dark:bg-slate-800 px-6">
        <div className="flex items-center">
          {isPathWithLogo ? (
            <Logo />
          ) : (
            <div className="flex animate-bonce-from-bottom transition active:scale-95">
              <button
                type="button"
                className="text-3xl text-pink-500"
                onClick={() => {
                  history.back();
                }}
              >
                <IoArrowBackOutline />
              </button>
              <span className="ml-3 text-2xl">
                {
                  pathTitles.find((path) => pathname.startsWith(path.prefix))
                    ?.title
                }
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center">
          {primaryWallet?.address && (
            <button
              onClick={() => {
                copyToClipboard(primaryWallet.address);
                toast.success('Copied!');
              }}
              className="transition active:text-slate-300 active:scale-95"
            >
              {shortenAddress(primaryWallet.address, 3)}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
