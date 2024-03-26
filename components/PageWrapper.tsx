'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';

const variants = {
  hidden: { opacity: 0, x: 0, y: 100 },
  enter: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, x: 0, y: -100 },
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
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) => {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, [pathname]);

  return (
    <AnimatePresence
      // mode="wait"
      initial={false}
      onExitComplete={() => {}}
    >
      {isMounted && (
        <>
          <motion.section
            id={id}
            className={className}
            key={pathname}
            variants={variants}
            // initial="enter"
            // animate="center"
            // exit="exit"
            initial="hidden"
            animate="enter"
            exit="exit"
            // transition={{ type: 'easeInOut' }}
            transition={{
              y: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
          >
            {children}
          </motion.section>
        </>
      )}
    </AnimatePresence>
  );
};

export default PageWrapper;
