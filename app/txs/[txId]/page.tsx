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
    <PageWrapper>
      <section id="page-tx" className="pb-6">
        <PageHeader
          title="Transaction details"
          subtitle="Check you TX status"
        />
        {!txData ? (
          'No data available'
        ) : (
          <>
            <p>TX ID: {txId}</p>
            <p>TX Status: {txData.status}</p>
            <p>TX To: {txData.pixName}</p>
            <p>
              TX Amount BRL: <AmountBRL amount={txData.amount} />
            </p>
            <p>
              TX Amount USDT: <AmountUSDT amount={txData.amountUsdt} />
            </p>
            <p>
              TX Rate: <AmountBRL amount={txData.amountRate} />
            </p>
          </>
        )}
      </section>
    </PageWrapper>
  );
}
