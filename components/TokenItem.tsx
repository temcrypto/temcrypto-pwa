// components/TokenItem.tsx

import { memo } from 'react';
import Image from 'next/image';

import { type TokenData } from '@/utils/getTokensData';
import { Rate } from '@/context/RatesContext';

/**
 * TokenItem component
 *
 * Displays a single token item with its logo, name, symbol, balance, and rate.
 * Memoized component with a proper equality check.
 *
 * @param {TokenData} token - The token data to display.
 * @param {number} rate - The rate of the token in USDT.
 */
const TokenItem = memo(
  function TokenItem({
    token: { name, symbol, logoFile, balance },
    rate,
  }: {
    token: TokenData;
    rate: Rate;
  }) {
    return (
      <div className="flex flex-row justify-between items-center">
        <div>
          <div className="flex flex-row">
            <Image
              src={`/images/tokens/${logoFile}`}
              alt={name}
              height={40}
              width={40}
              className="mr-2"
            />
            <div>
              <div className="font-extrabold">{name}</div>
              <div className="text-slate-500 text-sm">{symbol}</div>
            </div>
          </div>
        </div>
        <div>
          <div className="font-extrabold">{balance}</div>
          <div className="text-slate-500 text-sm">
            {(rate.value * parseFloat(balance)).toFixed(2) ?? '--'} USDT
          </div>
        </div>
      </div>
    );
  },
  // Proper equality check for memoization
  (prevProps, nextProps) => {
    return (
      prevProps.token.balance === nextProps.token.balance &&
      prevProps.rate === nextProps.rate
    );
  }
);

export default TokenItem;
