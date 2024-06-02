import { memo } from 'react';

const LoadingSkeleton = memo(function LoadingSkeleton({
  className = '',
}: {
  className: string;
}) {
  return (
    <div
      className={`animate-pulse rounded-md bg-slate-100 dark:bg-slate-700 ${className}`}
    />
  );
});

export default LoadingSkeleton;
