'use client';

import AmountUSDT from '@/components/AmountUSDT';
import PageWrapper from '@/components/PageWrapper';
import {
  DynamicUserProfile,
  useDynamicContext,
  useSendBalance,
} from '@/lib/dynamicxyz';
// import { getEnsAvatar, normalize } from 'viem/ens';

const MySendButton = () => {
  const { open } = useSendBalance();

  return <button onClick={() => open()}>Send</button>;
};

export default function Wallet() {
  const { primaryWallet, user, setShowDynamicUserProfile } =
    useDynamicContext();
  console.log('primaryWallet', primaryWallet);
  console.log('user', user);

  return (
    <PageWrapper id="page-wallet">
      <div className="text-left">
        <div className="text-md text-slate-400 font-light uppercase mb-3">
          My Balance
        </div>
        <p className="text-3xl dark:text-white break-words">
          <AmountUSDT amount={420.69} />
        </p>

        <div className="border-y border-gray-200 p-2">
          <MySendButton />
        </div>

        <div className="border-y border-gray-200 p-2">avatar</div>

        <div className="border-y border-gray-200 p-2">
          <button onClick={() => setShowDynamicUserProfile(true)}>
            Click to open DynamicUserProfile!
          </button>
          <DynamicUserProfile />
        </div>

        <div className="text-md text-slate-400 font-light uppercase mb-3">
          User
        </div>
        <p className="text-3xl dark:text-white break-words">
          Connected with{' '}
          {user?.ens
            ? user.ens.name
            : user?.verifiedCredentials[1]?.publicIdentifier}
        </p>

        <div className="text-md text-slate-400 font-light uppercase mb-3">
          Wallet
        </div>
        <p className="text-3xl dark:text-white break-words">
          {/* {primaryWallet} */}
        </p>
      </div>
    </PageWrapper>
  );
}
