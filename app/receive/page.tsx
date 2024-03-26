import PageHeader from '@/components/PageHeader';
import PageWrapper from '@/components/PageWrapper';

export default function Receive() {
  return (
    <PageWrapper id="page-receive">
      <PageHeader
        title="Receive"
        subtitle="Enter the amount you want to charge."
      />

      <form>
        <div className="relative mt-8 rounded-2xl shadow-sm text-xl">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <span className="text-slate-800">R$</span>
          </div>
          <input
            id="amount"
            name="amount"
            className="block w-full rounded-2xl border-0 py-4 pl-12 pr-4 text-gray-900 placeholder:text-slate-400 ring ring-slate-200 focus:ring-pink-500 focus:outline-none appearance-none"
            type="number"
            placeholder="0.00"
            min="1"
            step="any"
          />
        </div>

        <input
          type="submit"
          className="w-full bg-pink-500 rounded-2xl p-4 text-center text-white text-xl mt-8"
          value="Continue"
        />
      </form>
    </PageWrapper>
  );
}
