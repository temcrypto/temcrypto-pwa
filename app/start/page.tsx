'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  const { status: authStatus, update: updateStatus } = useSession({
    required: false,
  });
  const { showAuthFlow, isAuthenticated, handleLogOut } = useDynamicContext();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      updateStatus({ user: { email: 'info@test.com' } });
      if ('authenticated' === authStatus) {
        const redirectTo = searchParams.callbackUrl || '/';
        return router.push(redirectTo as string);
      } else {
        console.log('not authenticated');
        // handleLogOut();
      }
    }
  }, [isAuthenticated, authStatus, searchParams]);

  return (
    <PageWrapper id="page-start" className="flex h-full">
      <div className="flex flex-col w-full">
        <div className="flex grow items-center">
          <div className="w-full px-2">
            <div className="flex justify-center items-center w-60">
              <Lottie animationData={StartAnimation} loop={true} />
            </div>
            <h1 className="text-5xl font-extrabold mt-10">
              Start living in crypto with us!
            </h1>
            <h2 className="text-2xl text-slate-400 dark:text-slate-300 mt-6">
              Explore the flexibility of crypto with the simplicity of
              real-world.
            </h2>
            <h3 className="text-sm text-transparent bg-clip-text bg-gradient-to-br from-amber-500 via-pink-400 to-blue-500 text-center uppercase mt-16 mb-8">
              <div className="mt-6">Smart • Gasless • Non-Custodial</div>
            </h3>
          </div>
        </div>

        <div className="flex-none">
          {isAuthenticated && !showAuthFlow ? (
            <div className="flex justify-center items-center p-4 text-xl ">
              <Loading />
            </div>
          ) : (
            <DynamicConnectButton buttonClassName="w-full justify-center items-center p-4 text-xl text-white bg-pink-500 hover:bg-pink-600 active:bg-pink-700 rounded-2xl">
              Continue
            </DynamicConnectButton>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
