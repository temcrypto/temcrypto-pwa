import { type Address, parseAbi, formatUnits, isAddress } from 'viem';

import { wagmiConfig, multicall } from '@/lib/wagmi';
import supportedTokensList, { type SupportedToken } from '@/utils/tokenList';

// Define and export the TokenData type
export type TokenData = {
  name: string;
  symbol: string;
  logoFile: string;
  balance: number;
};

export async function getTokensData({
  address,
  supportedTokens = supportedTokensList,
}: {
  address: string;
  supportedTokens?: SupportedToken[];
}): Promise<TokenData[]> {
  try {
    // Check that the address is valid before querying the tokens
    if (!isAddress(address)) {
      throw new Error('Invalid address');
    }

    // Get the token balances for each token
    const calls = supportedTokens.map((token) => {
      return {
        address: token.address as Address,
        abi: parseAbi(['function balanceOf(address) view returns (uint256)']),
        functionName: 'balanceOf',
        args: [address],
      };
    });

    const balancesData = await multicall(wagmiConfig, { contracts: calls });

    // Format the balances for each token
    const tokensData = balancesData.map((balance, index) => {
      const token = supportedTokens[index];
      const tokenItemData: TokenData = {
        name: token.name,
        symbol: token.symbol,
        logoFile: token.logoURI.split('/').pop() ?? '',
        balance: 0, // Return string to keep the base type and be converted later
      };

      if (balance && balance.status === 'success') {
        const formattedBalance = formatUnits(balance.result, token.decimals);
        const isStablecoin = token.tags.includes('stablecoin');
        tokenItemData.balance = isStablecoin
          ? parseFloat(parseFloat(formattedBalance).toFixed(2))
          : parseFloat(parseFloat(formattedBalance).toFixed(8));
      }

      return tokenItemData;
    });

    return tokensData;
  } catch (err) {
    throw new Error(`Error getting tokens data: ${err}`);
  }
}
