import LoadingAnimation from '@/components/Loading';

export default function Loading() {
  return (
    <div className="flex flex-col h-full items-center justify-center p-8">
      <LoadingAnimation />
    </div>
  );
}
