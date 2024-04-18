'use client';

import { useEffect, useState } from 'react';

import PageHeader from '@/components/PageHeader';
import PageWrapper from '@/components/PageWrapper';
import { fetchTxById } from '@/app/send/actions';
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
      <PageHeader title="Transaction details" subtitle="Check you TX status" />
      {!txData ? (
        'No data available'
      ) : (
        <>
          <div className="w-full p-4 mb-4 rounded-2xl bg-slate-100 dark:bg-slate-700">
            <div className="text-sm text-slate-400 font-light uppercase">
              To
            </div>
            <p className="dark:text-white break-words">{txData.pixName}</p>

            <div className="text-sm text-slate-400 font-light uppercase mt-4">
              Chave Pix
            </div>
            <p className="dark:text-white break-words">{txData.pixKeyParsed}</p>
          </div>

          <div className="w-full p-4 mb-4 rounded-2xl bg-slate-100 dark:bg-slate-700">
            <div className="text-sm text-slate-400 font-light uppercase">
              Amount
            </div>
            <p className="dark:text-white break-words">
              <span>
                <AmountBRL amount={txData.amount as number} />
              </span>
              <span className="pl-1 text-sm text-slate-300">
                (<AmountUSDT amount={txData.amountUsdt as number} />)
              </span>
            </p>

            <div className="text-sm text-slate-400 font-light uppercase mt-4">
              Rate
            </div>
            <p className="dark:text-white break-words">
              <AmountUSDT amount={1} /> ={' '}
              <AmountBRL amount={txData.amountRate as number} />
            </p>
          </div>

          <div className="w-full p-4 mb-4 rounded-2xl bg-slate-100 dark:bg-slate-700">
            <div className="text-sm text-slate-400 font-light uppercase">
              TX ID
            </div>
            <p className="dark:text-white break-words">{txId}</p>
          </div>

          <div className="w-full p-4 mb-4 rounded-2xl bg-slate-100 dark:bg-slate-700">
            <div className="text-sm text-slate-400 font-light uppercase">
              TX ID
            </div>
            <p className="dark:text-white break-words">{txId}</p>
          </div>

          <div className="w-full p-4 mb-4 rounded-2xl bg-slate-100 dark:bg-slate-700">
            <div className="text-sm text-slate-400 font-light uppercase">
              TX ID
            </div>
            <p className="dark:text-white break-words">{txId}</p>
          </div>

          <div className="w-full p-4 mb-4 rounded-2xl bg-slate-100 dark:bg-slate-700">
            <div className="text-sm text-slate-400 font-light uppercase">
              TX ID
            </div>
            <p className="dark:text-white break-words">{txId}</p>
          </div>

          <div className="w-full p-4 mb-4 rounded-2xl bg-slate-100 dark:bg-slate-700">
            <div className="text-sm text-slate-400 font-light uppercase">
              TX ID
            </div>
            <p className="dark:text-white break-words">{txId}</p>
          </div>

          <div className="w-full p-4 mb-4 rounded-2xl bg-slate-100 dark:bg-slate-700">
            <div className="text-sm text-slate-400 font-light uppercase">
              TX ID
            </div>
            <p className="dark:text-white break-words">{txId}</p>
          </div>
        </>
      )}
    </PageWrapper>
  );
}
