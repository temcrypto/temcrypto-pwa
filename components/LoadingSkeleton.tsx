export default function LoadingSkeleton({ className }: { className: string }) {
  return (
    <div
      className={`animate-pulse bg-slate-200 dark:bg-slate-500 rounded-md ${className}`}
    />
  );
}
