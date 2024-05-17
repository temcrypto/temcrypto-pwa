import LoadingComponent from '@/components/Loading';

export default function Loading() {
  return (
    <main id="loading" className="flex-1">
      <LoadingComponent bounce={true} fullScreen={true} />
    </main>
  );
}
