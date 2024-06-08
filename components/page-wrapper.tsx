'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

import { useDynamicContext } from '@/lib/dynamicxyz';

import Loading from './Loading';

export default function PageWrapper({
  id,
  children,
  className = '',
  requireSession = false,
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
  requireSession?: boolean;
}) {
  const { status: appAuthStatus } = useSession({ required: requireSession });
  const { isAuthenticated: isWalletAuthenticated } = useDynamicContext();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // If the user wallet is not authenticated, redirect to start page.
    if (isMounted && pathname !== '/start' && !isWalletAuthenticated) {
      setIsMounted(false);
      window.location.href = '/start';
    }
  }, [isMounted, pathname, isWalletAuthenticated]);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  return (
    <>
      {!isMounted || appAuthStatus === 'loading' ? (
        <Loading bounce={true} fullScreen={true} />
      ) : (
        <div
          id={id}
          key={pathname}
          className={`animate-page-bounce ${className}`}
        >
          {children}
        </div>
      )}
    </>
  );
}
