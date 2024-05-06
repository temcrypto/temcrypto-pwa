import { type Address, parseAbi, type PublicClient, formatUnits } from 'viem';

import { WalletConnector } from '@/lib/dynamicxyz';
import allowedTokenList from '@/utils/allowedTokenList';

// Define and export the TokenItemData type
export type TokenItemData = {
  name: string;
  symbol: string;
  balance: string;
  logoFile: string;
};

export async function getTokenBalances(
  address: Address,
  walletConnector: WalletConnector
): Promise<TokenItemData[]> {
  try {
    const walletClient =
      (await walletConnector.getPublicClient()) as PublicClient;

    // Get the token balances for each token
    const calls = allowedTokenList.map((token) => {
      return {
        address: token.address as Address,
        abi: parseAbi(['function balanceOf(address) view returns (uint256)']),
        functionName: 'balanceOf',
        args: [address],
      };
    });

    const balancesData = await walletClient.multicall({ contracts: calls });

    // Format the balances for each token
    const tokenBalances = balancesData.map((balance, index) => {
      const token = allowedTokenList[index];
      const balanceItem: TokenItemData = {
        name: token.name,
        symbol: token.symbol,
        balance: '',
        logoFile: token.logoURI.split('/').pop() ?? '',
      };

      if (balance && balance.status === 'success') {
        const formattedBalance = formatUnits(balance.result, token.decimals);
        const isStablecoin = token.tags.includes('stablecoin');
        balanceItem.balance = isStablecoin
          ? parseFloat(formattedBalance).toFixed(2)
          : parseFloat(formattedBalance).toFixed(8);
      }

      return balanceItem;
    });

    return tokenBalances;
  } catch (err) {
    throw new Error(`Error getting token balances: ${err}`);
  }
}
