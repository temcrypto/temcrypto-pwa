'use client';

import Lottie from 'lottie-react';
import Link from 'next/link';

// Animation
import Animation404 from '@/lottie/404.json';

export default function NotFound() {
  return (
    <div className="flex flex-col h-full items-center justify-center p-8">
      <div className="w-10/12 max-w-sm">
        <Lottie animationData={Animation404} />
      </div>
      <h1 className="text-2xl mt-6">Page Not Found</h1>
      <p className="text-xl text-slate-400 mt-4">
        Could not find the requested resource
      </p>
      <Link href="/" className="mt-10">
        Return Home
      </Link>
    </div>
  );
}
