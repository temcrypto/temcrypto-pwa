import { memo } from 'react';
import Image from 'next/image';

import { useWalletContext } from '@/context/WalletContext';
import { type AllowedToken } from '@/utils/allowedTokens';

/**
 * TokenItem component
 *
 * Displays a single token item with its logo, name, symbol, balance, and balance converted to the baseCurrency.
 * Memoized component with a proper equality check.
 *
 * @param {AllowedToken} token - The token data to display.
 */
const TokenItem = memo(
  function TokenItem({ token }: { token: AllowedToken }) {
    const { balances, balancesInCurrency, baseCurrency } = useWalletContext();

    const balance = balances.get(token.symbol) ?? 0;
    const balanceInFiat = (balancesInCurrency.get(token.symbol) ?? 0).toFixed(
      2
    );

    console.log('TokenItem ~', token.symbol, balance, balanceInFiat);

    return (
      <div className="flex flex-row justify-between items-center">
        <div>
          <div className="flex flex-row">
            <Image
              // src={`/images/tokens/${token.logoURI}`}
              src={token.logoURI}
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
          <div className="font-extrabold">{balance}</div>
          <div className="text-slate-500 text-sm">
            {balanceInFiat} {baseCurrency}
          </div>
        </div>
      </div>
    );
  },
  // Proper equality check for memoization
  (prevProps, nextProps) => {
    return prevProps.token.address === nextProps.token.address;
  }
);

export default TokenItem;
