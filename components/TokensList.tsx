'use client';

import { useCallback } from 'react';

import { type Rate, useRates } from '@/context/RatesContext';
import { useDynamicContext } from '@/lib/dynamicxyz';
import { type TokenData } from '@/utils/getTokensData';

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
  tokens: TokenData[];
};

export default function TokensList({ tokens }: TokenListProps) {
  const { walletConnector } = useDynamicContext();
  const rates = useRates() as Rate[];

  // Memoize the getRateByCode function
  const getRateByCode = useCallback(
    (code: string) => {
      const rateByCode = rates.find((rate) => rate.code === code);
      return rateByCode ?? { code, value: 0 };
    },
    [rates]
  );

  // Render the TokenList component only when the wallet is connected and there are balances
  if (!walletConnector || tokens.length === 0) {
    return <LoadingSkeleton />;
  }

  console.log('TokensList', tokens);

  return (
    <div className="flex flex-col space-y-3 *:bg-slate-100 *:dark:bg-slate-700/60 *:rounded-3xl *:h-20 *:px-4">
      {tokens.map((token) => (
        <TokenItem
          key={token.symbol}
          token={token}
          rate={getRateByCode(token.symbol)}
        />
      ))}
    </div>
  );
}
