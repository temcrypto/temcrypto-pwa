import { memo, useMemo } from 'react';
import Image from 'next/image';

import { type TokenData } from '@/utils/getTokensData';
import { Rate } from '@/context/RatesContext';

type TokenItemProps = {
  token: TokenData;
  rate: Rate;
};

/**
 * TokenItem component
 *
 * Displays a single token item with its logo, name, symbol, balance, and rate.
 * Memoized component with a proper equality check.
 *
 * @param {TokenData} token - The token data to display.
 * @param {Rate} rate - The rate object containing the token's rate in USDT.
 */
const TokenItem = memo(
  function TokenItem({ token, rate }: TokenItemProps) {
    console.log('TokenItem ~ token', token, 'rate', rate);

    // Memoized component rendering
    const memoizedComponent = useMemo(() => {
      // Calculate the token's value in USDT
      const valueUsdt =
        (rate.value * parseFloat(token.balance)).toFixed(2) ?? '--';

      console.log('TokenItem ~ valueUsdt', valueUsdt);

      return (
        <div className="flex flex-row justify-between items-center">
          <div>
            <div className="flex flex-row">
              <Image
                src={`/images/tokens/${token.logoFile}`}
                alt={token.name}
                height={40}
                width={40}
                className="mr-2"
                unoptimized={true} // Set unoptimized for local images
              />
              <div>
                <div className="font-extrabold">{token.name}</div>
                <div className="text-slate-500 text-sm">{token.symbol}</div>
              </div>
            </div>
          </div>
          <div>
            <div className="font-extrabold">{token.balance}</div>
            {/* valueUsdt represents the token's value in USDT */}
            <div className="text-slate-500 text-sm">{valueUsdt} USDT</div>
          </div>
        </div>
      );
    }, [token, rate]);

    return memoizedComponent;
  },
  // Proper equality check for memoization
  (prevProps, nextProps) => {
    return (
      prevProps.token.balance === nextProps.token.balance &&
      prevProps.rate.value === nextProps.rate.value
    );
  }
);

export default TokenItem;
