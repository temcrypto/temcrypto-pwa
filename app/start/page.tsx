'use client';

import { useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';

import Loading from '@/components/Loading';
import { DynamicConnectButton, useDynamicContext } from '@/lib/dynamicxyz';

export default function StartPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { status: appAuthStatus } = useSession({ required: false });
  const {
    showAuthFlow,
    isAuthenticated: isWalletAuthenticated,
    handleLogOut,
    loadingNetwork,
  } = useDynamicContext();

  // Check for authentication status and redirect to callbackUrl or log out
  useEffect(() => {
    const checkAuth = async () => {
      if (appAuthStatus === 'authenticated') {
        if (isWalletAuthenticated) {
          const redirectTo = searchParams.callbackUrl || '/';
          window.location.href = redirectTo as string;
        } else {
          await signOut({ redirect: true, callbackUrl: '/start' });
        }
      }
    };

    checkAuth();
  }, [isWalletAuthenticated, appAuthStatus, searchParams, handleLogOut]);

  return (
    <div className="flex h-full animate-bounce-from-bottom flex-col">
      <div className="flex grow items-center text-left">
        <div className="my-10">
          <h1 className="text-4xl font-extrabold">
            <span className="text-sky-500">Start</span> living in crypto{' '}
            <span className="text-rose-500">with</span>{' '}
            <span className="text-amber-500">us</span>!
          </h1>
          <h2 className="mt-8 text-pretty text-2xl text-slate-300 dark:text-slate-400">
            Explore where digital freedom meets real-world ease.
          </h2>
          <h3 className="mt-16 animate-background bg-gradient-to-r from-pink-400 via-indigo-400 to-cyan-400 bg-[length:_400%_400%] bg-clip-text text-center text-sm uppercase text-transparent [animation-duration:_4s]">
            Smart • Gasless • Non-Custodial
          </h3>
        </div>
      </div>

      <div className="flex h-32 flex-none flex-col items-center text-center">
        {(isWalletAuthenticated && !showAuthFlow) ||
        (!isWalletAuthenticated && loadingNetwork) ? (
          <div className="flex h-full items-center justify-center text-xl">
            <Loading bounce={true} />
          </div>
        ) : (
          <>
            <DynamicConnectButton
              buttonContainerClassName="w-full animate-bounce-from-bottom"
              buttonClassName="flex w-full justify-center items-center p-4 text-xl text-white bg-pink-500 active:bg-pink-700 rounded-3xl"
            >
              Continue
            </DynamicConnectButton>
            <p className="text-pretty pt-4 text-sm text-slate-300 dark:text-slate-500">
              By proceeding, you agree to TEMCRYPTO&apos;s{' '}
              <a
                href="https://temcrypto.com/terms"
                className="underline"
                target="_blank"
              >
                Terms of Use
              </a>
              .
            </p>
          </>
        )}
      </div>
    </div>
  );
}
