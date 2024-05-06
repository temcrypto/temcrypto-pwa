import { memo } from 'react';
import Image from 'next/image';

import { TokenItemData } from '@/utils/getTokenBalances';

/**
 * TokenItem component
 *
 * Displays a single token item with its logo, name, symbol, balance, and rate.
 * Memoized component with a proper equality check.
 *
 * @param {TokenItemData} token - The token data to display.
 * @param {number} rate - The rate of the token in USDT.
 */
const TokenItem = memo(
  function TokenItem({
    token: { name, symbol, logoFile, balance },
    rate,
  }: {
    token: TokenItemData;
    rate: number;
  }) {
    return (
      <div className="token-item flex flex-row justify-between items-center">
        <div className="token-item-data">
          <div className="flex flex-row">
            <Image
              src={`/images/tokens/${logoFile}`}
              alt={name}
              height={38}
              width={38}
              className="mr-2"
            />
            <div>
              <div className="font-extrabold">{name}</div>
              <div className="text-slate-500 text-sm">{symbol}</div>
            </div>
          </div>
        </div>
        <div className="token-item-amount">
          <div className="font-extrabold">{balance}</div>
          <div className="text-slate-500 text-sm">{rate ?? '--'} USDT</div>
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
