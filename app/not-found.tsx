'use client';

import Link from 'next/link';
import Lottie from 'lottie-react';

// Animation
import Animation404 from '@/lottie/404.json';

export default function NotFound() {
  return (
    <div className="flex h-full flex-col items-center justify-center p-8">
      <div className="w-8/12 max-w-sm">
        <Lottie animationData={Animation404} />
      </div>
      <h1 className="mt-8 text-2xl">Page Not Found</h1>
      <p className="mt-4 text-center text-xl text-slate-400">
        Could not find the requested resource
      </p>
      <Link href="/" className="mt-10 text-pink-500">
        Return Home
      </Link>
    </div>
  );
}
