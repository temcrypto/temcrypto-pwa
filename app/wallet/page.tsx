'use client';

import PageWrapper from '@/components/PageWrapper';
import {
  DynamicUserProfile,
  useDynamicContext,
  // useSendBalance,
} from '@/lib/dynamicxyz';
import { useSession } from 'next-auth/react';
// import { getEnsAvatar, normalize } from 'viem/ens';

const Wallet = () => {
  const session = useSession();
  const { primaryWallet, user, setShowDynamicUserProfile, handleLogOut } =
    useDynamicContext();

  console.log('primaryWallet', primaryWallet);
  console.log('user', user);
  console.log('session', session);

  return (
    <PageWrapper id="page-wallet">
      <div className="text-left">
        <div className="text-md text-slate-400 font-light uppercase mb-3">
          Wallet
        </div>
        <div className="dark:text-white break-words">
          {primaryWallet?.address}
        </div>

        <div className="border-y border-gray-200 p-2 my-6">
          <button onClick={() => setShowDynamicUserProfile(true)}>
            Click to open DynamicUserProfile!
          </button>
          <DynamicUserProfile />
        </div>

        <div className="text-md text-slate-400 font-light uppercase mb-3 mt-6">
          Connected with
        </div>
        <div className="dark:text-white break-words">
          {user?.ens ? user.ens.name : user?.email}
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
