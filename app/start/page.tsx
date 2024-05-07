'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import Lottie from 'lottie-react';

import Loading from '@/components/Loading';
import PageWrapper from '@/components/PageWrapper';
import { DynamicConnectButton, useDynamicContext } from '@/lib/dynamicxyz';

// Animations
import StartAnimation from '@/lottie/start.json';

export default function StartPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { status: authStatus } = useSession({ required: false });
  const dynamicContext = useDynamicContext();
  const { showAuthFlow, isAuthenticated, handleLogOut } = dynamicContext;
  const prevAuthenticated = useRef(isAuthenticated);

  // Check for authentication status and redirect to callbackUrl or log out
  useEffect(() => {
    if (isAuthenticated) {
      if (authStatus === 'authenticated') {
        const redirectTo = searchParams.callbackUrl || '/';
        window.location.href = redirectTo as string;
      }

      if (authStatus === 'unauthenticated' && prevAuthenticated.current) {
        handleLogOut();
      }
    }
  }, [isAuthenticated, authStatus, searchParams, handleLogOut]);

  return (
    <PageWrapper id="page-start" className="flex h-full">
      <div className="flex flex-col w-full">
        <div className="flex grow items-center text-center">
          <div className="w-full px-2">
            <div className="m-auto w-48">
              <Lottie animationData={StartAnimation} loop={true} />
            </div>
            <h1 className="text-5xl font-extrabold mt-10">
              Start living in crypto with us!
            </h1>
            <h2 className="text-2xl text-slate-400 dark:text-slate-300 mt-6">
              Explore where digital freedom meets real-world ease.
            </h2>
            <h3 className="text-sm text-transparent bg-clip-text bg-gradient-to-br from-amber-500 via-pink-400 to-blue-500 uppercase mt-16 mb-8">
              <div className="mt-6">Smart • Gasless • Non-Custodial</div>
            </h3>
          </div>
        </div>

        <div className="flex-none text-center">
          {isAuthenticated && !showAuthFlow ? (
            <div className="flex justify-center items-center p-4 text-xl ">
              <Loading bounce={true} />
            </div>
          ) : (
            <>
              <DynamicConnectButton buttonClassName="w-full justify-center items-center p-4 text-xl text-white bg-pink-500 hover:bg-pink-600 active:bg-pink-700 rounded-2xl">
                Continue
              </DynamicConnectButton>
              <p className="text-slate-300 dark:text-slate-400 text-sm py-6 safe-m-bottom text-pretty">
                By proceeding, you agree to TEMCRYPTO&apos;s{' '}
                <Link
                  href="https://temcrypto.com/terms-of-use"
                  className="underline"
                >
                  Terms of Use
                </Link>
                .
              </p>
            </>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
