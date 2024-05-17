'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
// import Lottie from 'lottie-react';

import Loading from '@/components/Loading';
import PageWrapper from '@/components/PageWrapper';
import { DynamicConnectButton, useDynamicContext } from '@/lib/dynamicxyz';

// Animations
// import StartAnimation from '@/lottie/start.json';

export default function StartPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { status: authStatus } = useSession({ required: false });
  const { showAuthFlow, isAuthenticated, handleLogOut } = useDynamicContext();
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
        <div className="flex grow items-center text-left">
          <div className="w-full px-2">
            {/* <div className="m-auto w-40">
              <Lottie animationData={StartAnimation} loop={true} />
            </div> */}
            <h1 className="text-4xl font-extrabold mt-20">
              <span className="text-rose-500">Start</span> living in crypto{' '}
              <span className="text-cyan-500">with</span>{' '}
              <span className="text-amber-500">us</span>!
            </h1>
            <h2 className="text-2xl text-slate-300 dark:text-slate-400 text-pretty mt-8">
              Explore where digital freedom meets real-world ease.
            </h2>
            <h3 className="text-sm text-center text-transparent animate-background bg-[length:_400%_400%] [animation-duration:_4s] bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-pink-400 uppercase mt-16 mb-14">
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
              <DynamicConnectButton buttonClassName="w-full justify-center items-center p-4 text-xl text-white bg-pink-500 active:bg-pink-700 rounded-3xl">
                Continue
              </DynamicConnectButton>
              <p className="text-slate-300 dark:text-slate-500 text-sm py-6 safe-m-bottom text-pretty">
                By proceeding, you agree to TEMCRYPTO&apos;s{' '}
                <Link
                  href="https://temcrypto.com/terms"
                  className="underline"
                  target="_blank"
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
