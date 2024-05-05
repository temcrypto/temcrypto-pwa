'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { AnimatePresence, motion } from 'framer-motion';

import { useDynamicContext } from '@/lib/dynamicxyz';

import Loading from './Loading';
import { signOut } from '@/auth';

// Motion settings
const motionVariants = {
  hidden: { opacity: 0, x: 0, y: 85 },
  enter: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, x: 0, y: -80 },
};

const motionTransition = {
  y: { type: 'spring', stiffness: 150, damping: 20 },
  opacity: { duration: 0.25 },
};

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
  const { primaryWallet } = useDynamicContext();
  const pathname = usePathname();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  console.log('primaryWallet', primaryWallet);
  console.log('router', router);

  useEffect(() => {
    if (primaryWallet) {
      setIsMounted(true);
      return () => {
        setIsMounted(false);
      };
    } else {
      signOut({ redirectTo: '/start' });
    }
  }, [primaryWallet]);

  return (
    <main
      id="main"
      className="flex-1 overflow-y-scroll scroll-smooth px-6 py-8 overflow-hidden"
    >
      {authStatus === 'loading' ? (
        <Loading bounce={true} fullScreen={true} />
      ) : (
        <AnimatePresence initial={false}>
          {isMounted && (
            <motion.div
              id={id}
              key={pathname}
              className={className}
              variants={motionVariants}
              initial="hidden"
              animate="enter"
              exit="exit"
              transition={motionTransition}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </main>
  );
}
