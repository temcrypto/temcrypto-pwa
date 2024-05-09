'use client';

import { useCallback, useEffect, useState } from 'react';
import { isAddress, type Address } from 'viem';

import { type Rate, useRates } from '@/context/RatesContext';
import { useDynamicContext } from '@/lib/dynamicxyz';
import { getTokensData, type TokenData } from '@/utils/getTokensData';

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

export default function TokensList({ address }: TokenListProps) {
  const { walletConnector } = useDynamicContext();
  const [tokensData, setTokensData] = useState<TokenData[]>([]);
  const rates = useRates() as Rate[];

  // Validate the address before fetching the tokens data
  const isValidAddress = isAddress(address);

  // Memoize the getRateByCode function
  const getRateByCode = useCallback(
    (code: string) => {
      const rateByCode = rates.find((rate) => rate.code === code);
      return rateByCode ?? { code, value: 0 };
    },
    [rates]
  );

  // Move the fetchBalance logic to a separate effect
  useEffect(() => {
    const fetchBalance = async () => {
      if (walletConnector && isValidAddress) {
        try {
          const data = await getTokensData({
            address,
            walletConnector,
          });
          setTokensData(data);
        } catch (err) {
          console.error('Error getting token balances:', err);
        }
      }
    };

    fetchBalance();
  }, [walletConnector, address, isValidAddress]);

  // Render an error message when the address is invalid
  if (walletConnector && !isValidAddress) {
    return <div className="text-red-400">Error: Invalid address</div>;
  }

  // Render the TokenList component only when the wallet is connected and there are balances
  if (!walletConnector || tokensData.length === 0) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="flex flex-col space-y-3 *:bg-slate-100 *:dark:bg-slate-700 *:rounded-3xl *:h-20 *:px-4">
      {tokensData.map((token) => (
        <TokenItem
          key={token.symbol}
          token={token}
          rate={getRateByCode(token.symbol)}
        />
      ))}
    </div>
  );
}
