'use client';

import Link from 'next/link';
import Lottie from 'lottie-react';

// Animation
import Animation404 from '@/lottie/404.json';

export default function NotFound() {
  return (
    <div className="flex flex-col h-full items-center justify-center p-8">
      <div className="w-8/12 max-w-sm">
        <Lottie animationData={Animation404} />
      </div>
      <h1 className="text-2xl mt-8">Page Not Found</h1>
      <p className="text-xl text-slate-400 text-center mt-4">
        Could not find the requested resource
      </p>
      <Link href="/" className="mt-10 text-pink-500">
        Return Home
      </Link>
    </div>
  );
}
