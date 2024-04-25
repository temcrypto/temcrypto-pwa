'use client';

import Image from 'next/image';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

import PageWrapper from '@/components/PageWrapper';
import useCopyToClipboard from '@/hooks/useCopyToClipboard';
import { useDynamicContext } from '@/lib/dynamicxyz';
import shortenAddress from '@/utils/shortenAddress';

const Wallet = () => {
  const { data: session, status } = useSession({ required: true });
  const { primaryWallet, user, handleLogOut } = useDynamicContext();
  const [copiedText, copyToClipboard] = useCopyToClipboard();

  console.log('Wallet ~ session', session, status);
  console.log('Wallet ~ primaryWallet', primaryWallet);
  console.log('Wallet ~ user', user);

  if ('authenticated' !== status) return null;

  const userWallet = primaryWallet?.address ?? '';
  const userAuthenticatedWith =
    (user?.isAuthenticatedWithAWallet
      ? user.wallet
      : user?.ens
      ? user.ens.name
      : user?.email) ?? '';

  return (
    <PageWrapper id="page-wallet">
      <div className="text-left">
        <div className="text-md text-slate-400 font-light uppercase mb-3">
          Wallet
        </div>
        <div className="dark:text-white break-words">
          <button
            onClick={() => {
              copyToClipboard(userWallet);
              toast.success('Copied!');
            }}
            className="transition active:text-slate-300 active:scale-95"
          >
            {shortenAddress(userWallet)}
          </button>
        </div>

        <div className="text-md text-slate-400 font-light uppercase mb-3 mt-6">
          Connected with
        </div>
        <div className="flex dark:text-white break-words items-center">
          <Image
            src={`https://iconic.dynamic-static-assets.com/icons/sprite.svg#${userAuthenticatedWith}`}
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
            className="text-red-500 dark:text-white uppercase hover:text-pink-500"
            onClick={() => handleLogOut()}
          >
            Signout
          </button>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Wallet;
