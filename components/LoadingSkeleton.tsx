export default function LoadingSkeleton({ className }: { className: string }) {
  return (
    <div
      className={`animate-pulse bg-slate-100 dark:bg-slate-700 rounded-md ${className}`}
    />
  );
}
