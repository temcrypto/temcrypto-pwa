'use client';

import { useEffect, useState } from 'react';

import { fetchTxById } from '@/app/payments/actions';
import PageWrapper from '@/components/page-wrapper';
import { NewTransaction } from '@/lib/db/schema';
import AmountBRL from '@/components/AmountBRL';
import AmountUSDT from '@/components/AmountUSDT';

export default function Txs({
  params,
}: // searchParams,
{
  params: { txId: string };
  // searchParams: { [key: string]: string | string[] | undefined };
}) {
  const [txData, setTxData] = useState<NewTransaction | undefined>(undefined);
  const { txId } = params;

  useEffect(() => {
    async function fetchTx() {
      const data = await fetchTxById(txId);
      setTxData(data);
    }

    fetchTx();
  }, [txId]);

  return (
    <PageWrapper id="page-tx">
      {!txData ? (
        'No data available'
      ) : (
        <>
          <div className="mb-4 w-full rounded-2xl bg-slate-100 p-4 dark:bg-slate-700">
            <div className="text-sm font-light uppercase text-slate-400">
              To
            </div>
            <p className="break-words dark:text-white">{txData.pixName}</p>

            <div className="mt-4 text-sm font-light uppercase text-slate-400">
              Chave Pix
            </div>
            <p className="break-words dark:text-white">{txData.pixKeyParsed}</p>
          </div>

          <div className="mb-4 w-full rounded-2xl bg-slate-100 p-4 dark:bg-slate-700">
            <div className="text-sm font-light uppercase text-slate-400">
              Amount
            </div>
            <p className="break-words dark:text-white">
              <span>
                <AmountBRL amount={txData.amount as number} />
              </span>
              <span className="pl-1 text-sm text-slate-300">
                (<AmountUSDT amount={txData.amountUsdt as number} />)
              </span>
            </p>

            <div className="mt-4 text-sm font-light uppercase text-slate-400">
              Rate
            </div>
            <p className="break-words dark:text-white">
              <AmountUSDT amount={1} /> ={' '}
              <AmountBRL amount={txData.amountRate as number} />
            </p>
          </div>

          <div className="mb-4 w-full rounded-2xl bg-slate-100 p-4 dark:bg-slate-700">
            <div className="text-sm font-light uppercase text-slate-400">
              TX ID
            </div>
            <p className="break-words dark:text-white">{txId}</p>
          </div>

          <div className="mb-4 w-full rounded-2xl bg-slate-100 p-4 dark:bg-slate-700">
            <div className="text-sm font-light uppercase text-slate-400">
              TX ID
            </div>
            <p className="break-words dark:text-white">{txId}</p>
          </div>

          <div className="mb-4 w-full rounded-2xl bg-slate-100 p-4 dark:bg-slate-700">
            <div className="text-sm font-light uppercase text-slate-400">
              TX ID
            </div>
            <p className="break-words dark:text-white">{txId}</p>
          </div>

          <div className="mb-4 w-full rounded-2xl bg-slate-100 p-4 dark:bg-slate-700">
            <div className="text-sm font-light uppercase text-slate-400">
              TX ID
            </div>
            <p className="break-words dark:text-white">{txId}</p>
          </div>

          <div className="mb-4 w-full rounded-2xl bg-slate-100 p-4 dark:bg-slate-700">
            <div className="text-sm font-light uppercase text-slate-400">
              TX ID
            </div>
            <p className="break-words dark:text-white">{txId}</p>
          </div>

          <div className="mb-4 w-full rounded-2xl bg-slate-100 p-4 dark:bg-slate-700">
            <div className="text-sm font-light uppercase text-slate-400">
              TX ID
            </div>
            <p className="break-words dark:text-white">{txId}</p>
          </div>
        </>
      )}
    </PageWrapper>
  );
}
