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
  const { status: authStatus } = useSession({ required: requireSession });
  const { isAuthenticated } = useDynamicContext();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  // If the user wallet is not authenticated, redirect to start page.
  if (isMounted && pathname !== '/start' && !isAuthenticated) {
    setIsMounted(false);
    window.location.href = '/start';
  }

  return (
    <main
      id="main"
      className="flex-1 overflow-y-scroll scroll-smooth px-6 py-8 overflow-hidden"
    >
      {!isMounted || authStatus === 'loading' ? (
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
    </main>
  );
}
