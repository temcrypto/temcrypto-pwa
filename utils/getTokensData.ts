// utils/getTokensData.ts

import { type Address, parseAbi, type PublicClient, formatUnits } from 'viem';

import { WalletConnector } from '@/lib/dynamicxyz';
import allowedTokensList, { type AllowedToken } from '@/utils/allowedTokens';

// Define and export the TokenData type
export type TokenData = {
  name: string;
  symbol: string;
  logoFile: string;
  balance: string;
};

export async function getTokensData({
  address,
  walletConnector,
  allowedTokens = allowedTokensList,
}: {
  address: Address;
  walletConnector: WalletConnector;
  allowedTokens?: AllowedToken[];
}): Promise<TokenData[]> {
  try {
    const walletClient =
      (await walletConnector.getPublicClient()) as PublicClient;

    // Get the token balances for each token
    const calls = allowedTokens.map((token) => {
      return {
        address: token.address as Address,
        abi: parseAbi(['function balanceOf(address) view returns (uint256)']),
        functionName: 'balanceOf',
        args: [address],
      };
    });

    const balancesData = await walletClient.multicall({ contracts: calls });

    // Format the balances for each token
    const tokensData = balancesData.map((balance, index) => {
      const token = allowedTokens[index];
      const tokenItemData: TokenData = {
        name: token.name,
        symbol: token.symbol,
        logoFile: token.logoURI.split('/').pop() ?? '',
        balance: '',
      };

      if (balance && balance.status === 'success') {
        const formattedBalance = formatUnits(balance.result, token.decimals);
        const isStablecoin = token.tags.includes('stablecoin');
        tokenItemData.balance = isStablecoin
          ? parseFloat(formattedBalance).toFixed(2)
          : parseFloat(formattedBalance).toFixed(8);
      }

      return tokenItemData;
    });

    return tokensData;
  } catch (err) {
    throw new Error(`Error getting tokens data: ${err}`);
  }
}