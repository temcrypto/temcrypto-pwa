'use client';

import { useCallback, useEffect, useState } from 'react';
import { type Address } from 'viem';

import { type Rate, useRates } from '@/context/RatesContext';
import { useDynamicContext } from '@/lib/dynamicxyz';
import { getTokenBalances, type TokenItemData } from '@/utils/getTokenBalances';

import TokenItem from './TokenItem';

function LoadingSkeleton() {
  return (
    <div className="flex flex-col space-y-3 *:bg-slate-100 *:dark:bg-slate-700 *:rounded-3xl *:h-20 *:animate-pulse">
      <div className="" />
      <div className="" />
      <div className="" />
      <div className="" />
      <div className="" />
      <div className="" />
      <div className="" />
    </div>
  );
}

// Define the TokenList props type
type TokenListProps = {
  address: Address;
};

export default function TokenList({ address }: TokenListProps) {
  const { walletConnector } = useDynamicContext();
  const [tokenBalances, setBalances] = useState<TokenItemData[]>([]);
  const rates = useRates() as Rate[];

  // Memoize the getRateForCode function to avoid unnecessary re-computation
  const getRateForCode = useCallback(
    (code: string) => {
      const rate = rates.find((rate) => rate.code === code)?.rate;
      return rate ?? 0;
    },
    [rates]
  );

  // Move the fetchBalance logic to a separate effect
  useEffect(() => {
    const fetchBalance = async () => {
      if (walletConnector) {
        try {
          const balances = await getTokenBalances(
            address as Address,
            walletConnector
          );
          setBalances(balances);
        } catch (err) {
          console.error('Error getting token balances:', err);
        }
      }
    };

    fetchBalance();
  }, [walletConnector, address]);

  // Render the TokenList component only when the wallet is connected and there are balances
  if (!walletConnector || tokenBalances.length === 0) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="flex flex-col space-y-3 *:bg-slate-100 *:dark:bg-slate-700 *:rounded-3xl *:h-20 *:px-4">
      {tokenBalances.map((token) => (
        <TokenItem
          key={token.symbol}
          token={token}
          rate={getRateForCode(token.symbol)}
        />
      ))}
    </div>
  );
}
