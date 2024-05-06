'use client';

import { useCallback, useEffect, useState } from 'react';
import { type Address } from 'viem';

import { type Rate, useRates } from '@/context/RatesContext';
import { useDynamicContext } from '@/lib/dynamicxyz';
import { getTokenBalances, type TokenItemData } from '@/utils/getTokenBalances';

import Loading from './Loading';
import TokenItem from './TokenItem';

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

  return (
    <div className="flex flex-col space-y-6 mt-4">
      {!walletConnector && <Loading />}
      {tokenBalances.map((token) => (
        <TokenItem
          key={token.symbol} // Use a unique key for better performance
          token={token}
          rate={getRateForCode(token.symbol)}
        />
      ))}
    </div>
  );
}
