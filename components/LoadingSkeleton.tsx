export default function LoadingSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-slate-200 dark:bg-slate-800 rounded-md h-5 w-24 ${className}`}
    ></div>
  );
}
