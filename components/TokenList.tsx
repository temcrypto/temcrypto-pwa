'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  type Address,
  createPublicClient,
  http,
  parseAbi,
  formatUnits,
} from 'viem';
import { polygon, polygonAmoy, polygonMumbai } from 'viem/chains';

// This is a subset of https://api-polygon-tokens.polygon.technology/tokenlists/polygonPopular.tokenlist.json
// TODO: Improve this to get from the API or cache
const allowedTokenList = [
  {
    chainId: 137,
    name: 'Matic Token',
    symbol: 'MATIC',
    decimals: 18,
    address: '0x0000000000000000000000000000000000001010',
    logoURI: 'https://assets.polygon.technology/tokenAssets/matic.svg',
    tags: ['plasma', 'native', 'swapable'],
    extensions: {
      originTokenAddress: '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0',
      originTokenNetwork: 0,
    },
  },
  {
    chainId: 137,
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
    address: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
    logoURI: 'https://assets.polygon.technology/tokenAssets/eth.svg',
    tags: ['pos', 'erc20', 'swapable', 'metaTx'],
    extensions: {
      originTokenAddress: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      originTokenNetwork: 0,
    },
  },
  {
    chainId: 137,
    name: 'Tether USD',
    symbol: 'USDT',
    decimals: 6,
    address: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
    logoURI: 'https://assets.polygon.technology/tokenAssets/usdt.svg',
    tags: ['pos', 'stablecoin', 'erc20', 'swapable', 'metaTx'],
    extensions: {
      originTokenAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7',
      originTokenNetwork: 0,
    },
  },
  {
    chainId: 137,
    name: 'Bridged USD Coin',
    symbol: 'USDC.e',
    decimals: 6,
    address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
    logoURI: 'https://assets.polygon.technology/tokenAssets/usdc.svg',
    tags: ['pos', 'erc20', 'swapable', 'metaTx', 'stablecoin'],
    extensions: {
      originTokenAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      originTokenNetwork: 0,
    },
  },
  {
    chainId: 137,
    name: 'Dai',
    symbol: 'DAI',
    decimals: 18,
    address: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063',
    logoURI: 'https://assets.polygon.technology/tokenAssets/dai.svg',
    tags: ['pos', 'stablecoin', 'erc20', 'swapable', 'metaTx'],
    extensions: {
      originTokenAddress: '0x6b175474e89094c44da98b954eedeac495271d0f',
      originTokenNetwork: 0,
    },
  },
];

// Create a public client for interacting with the Polygon (Matic) mainnet
const client = createPublicClient({
  chain: polygon,
  transport: http(),
});

async function getTokenBalances(address: Address): Promise<TokenItemData[]> {
  try {
    const promises = allowedTokenList.map(async (token) => {
      return client
        .readContract({
          address: token.address as Address,
          abi: parseAbi(['function balanceOf(address) view returns (uint256)']),
          functionName: 'balanceOf',
          args: [address],
        })
        .catch((err) => {
          throw new Error(`Error getting balance for ${token.symbol}: ${err}`);
        });
    });

    const balancesData = await Promise.all(promises);

    return balancesData.map((balance, index) => {
      const token = allowedTokenList[index];
      const formattedBalance = formatUnits(balance, token.decimals);
      return {
        name: token.name,
        symbol: token.symbol,
        balance: formattedBalance,
        logoFile: token.logoURI.split('/').pop() ?? '',
      };
    });
  } catch (err) {
    throw new Error(`Error getting token balances: ${err}`);
  }
}

type TokenItemData = {
  name: string;
  symbol: string;
  balance: string;
  logoFile: string;
};

function TokenItem({ name, symbol, logoFile, balance }: TokenItemData) {
  return (
    <>
      <div className="token-item flex flex-row justify-between items-center">
        <div className="token-item-data">
          <div className="flex flex-row">
            <Image
              src={`/images/tokens/${logoFile}`}
              alt={name}
              height={35}
              width={35}
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
          <div className="text-slate-500 text-sm">{balance} USDT</div>
        </div>
      </div>
    </>
  );
}

export default function TokenList({ address }: { address: Address }) {
  const [tokenBalances, setBalances] = useState<TokenItemData[]>([]);

  useEffect(() => {
    const fetchBalance = async () => {
      const balances = await getTokenBalances(address as Address);
      console.log('balances', balances);
      setBalances(balances as TokenItemData[]);
    };
    fetchBalance();
  }, [address]);

  return (
    <>
      <div className="flex flex-col space-y-6 mt-4">
        {tokenBalances.map((token) => (
          <TokenItem
            key={token.name}
            name={token.name}
            symbol={token.symbol}
            logoFile={token.logoFile}
            balance={token.balance}
          />
        ))}
      </div>
    </>
  );
}
