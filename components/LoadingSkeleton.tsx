export default function LoadingSkeleton({
  width = 20,
  height = 5,
  rounded = 'md',
}: {
  width?: number;
  height?: number;
  rounded?: string;
}) {
  // Define width and height of the skeleton based on tailwindcss classes
  const widthClass = `w-${width}`;
  const heightClass = `h-${height}`;
  const roundedClass = `rounded-${rounded}`;

  return (
    <div
      className={`animate-pulse bg-slate-200 dark:bg-slate-500 ${roundedClass} ${widthClass} ${heightClass}`}
    ></div>
  );
}
