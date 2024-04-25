'use client';

import { useSession } from 'next-auth/react';

import PageWrapper from '@/components/PageWrapper';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { useDynamicContext } from '@/lib/dynamicxyz';
import truncateEthAddress from '@/utils/truncateEthAddress';
import toast from 'react-hot-toast';

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
            {truncateEthAddress(userWallet)}
          </button>
        </div>

        <div className="text-md text-slate-400 font-light uppercase mb-3 mt-6">
          Connected with
        </div>
        <div className="dark:text-white break-words">
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
