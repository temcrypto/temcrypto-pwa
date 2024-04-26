'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { SessionProvider, useSession } from 'next-auth/react';
import { AnimatePresence, motion } from 'framer-motion';

import Loading from './Loading';

const variants = {
  hidden: { opacity: 0, x: 0, y: 85 },
  enter: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, x: 0, y: -80 },
};

// const variants = {
//   enter: (direction: number) => {
//     return {
//       x: direction > 0 ? 200 : -200,
//       opacity: 1,
//     };
//   },
//   center: {
//     zIndex: 1,
//     x: 0,
//     opacity: 1,
//   },
//   exit: (direction: number) => {
//     return {
//       zIndex: 0,
//       x: direction < 0 ? 200 : -200,
//       opacity: 0,
//     };
//   },
// };

const PageWrapper = ({
  id,
  children,
  className = '',
  requireSession = false,
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
  requireSession?: boolean;
}) => {
  const { data: session, status } = useSession({ required: requireSession });
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const isAuthenticated = status === 'authenticated';

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, [isAuthenticated]);

  if (status === 'loading') return <Loading />;

  return (
    <AnimatePresence
      // mode="wait"
      initial={false}
      onExitComplete={() => {}}
    >
      <main
        id="main"
        className="flex-1 overflow-y-scroll scroll-smooth px-6 py-8 overflow-hidden"
      >
        {isMounted && (
          <motion.div
            id={id}
            key={pathname}
            className={className}
            variants={variants}
            // initial="enter"
            // animate="center"
            // exit="exit"
            initial="hidden"
            animate="enter"
            exit="exit"
            // transition={{ type: 'easeInOut' }}
            transition={{
              y: { type: 'spring', stiffness: 150, damping: 20 },
              opacity: { duration: 0.25 },
            }}
          >
            <SessionProvider session={session}>{children}</SessionProvider>
          </motion.div>
        )}
      </main>
    </AnimatePresence>
  );
};

export default PageWrapper;
