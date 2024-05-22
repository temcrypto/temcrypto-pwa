'use client';

import { memo, useCallback } from 'react';

import { type Rate, useRates } from '@/context/RatesContext';
import { useDynamicContext } from '@/lib/dynamicxyz';
import { type TokenData } from '@/utils/getTokensData';

import TokenItem from './TokenItem';

// Loading skeleton component
function LoadingSkeleton() {
  return (
    <div className="flex flex-col space-y-3 *:h-20 *:px-4 *:bg-slate-100 *:dark:bg-slate-700/60 *:rounded-3xl *:animate-pulse">
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

const TokensList = memo(function TokensList({ tokens }: TokenListProps) {
  const { walletConnector } = useDynamicContext();
  const ratesList = useRates() as Rate[];

  // Memoize the getRateByCode function
  const getRateByCode = useCallback(
    (code: string) => {
      const rateByCode = ratesList.find((rate) => rate.code === code);
      return rateByCode ?? { code, name: '', rate: 0 };
    },
    [ratesList]
  );

  // Render the TokenList component only when the wallet is connected and there are balances
  if (!walletConnector || tokens.length === 0) {
    return <LoadingSkeleton />;
  }

  console.log('TokensList', tokens);

  return (
    <div className="flex flex-col space-y-3 *:h-20 *:px-4">
      {tokens.map((token) => (
        <TokenItem
          key={token.symbol}
          token={token}
          rate={getRateByCode(token.symbol)}
        />
      ))}
    </div>
  );
});

export default TokensList;
