export default function LoadingSkeleton({
  className,
  width,
  height,
  rounded,
}: {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: string;
}) {
  // Define width and height of the skeleton based on tailwindcss classes
  // width = 'w-48'
  // height = 'h-48'
  const widthClass = `w-${width || '16'}`;
  const heightClass = `h-${height || '16'}`;
  const roundedClass = `rounded-${rounded || 'md'}`;

  return (
    <div
      className={`animate-pulse bg-slate-200 dark:bg-slate-500 ${roundedClass} ${widthClass} ${heightClass} ${className}`}
    ></div>
  );
}
