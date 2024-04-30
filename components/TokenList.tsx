import Image from 'next/image';

// This is a subset of https://api-polygon-tokens.polygon.technology/tokenlists/polygonPopular.tokenlist.json
// TODO: Improve this to get from the API or cache
const allowedTokenList = [
  {
    chainId: 1101,
    name: 'Matic',
    symbol: 'MATIC',
    decimals: 18,
    address: '0xa2036f0538221a77a3937f1379699f44945018d0',
    logoURI: 'https://assets.polygon.technology/tokenAssets/matic.svg',
    tags: ['lxly', 'erc20'],
    extensions: {
      originTokenAddress: '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0',
      originTokenNetwork: 0,
      wrappedTokenNetwork: 1,
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
    chainId: 1101,
    name: 'Tether USD',
    symbol: 'USDT',
    decimals: 6,
    address: '0x1e4a5963abfd975d8c9021ce480b42188849d41d',
    logoURI: 'https://assets.polygon.technology/tokenAssets/usdt.svg',
    tags: ['lxly', 'stablecoin', 'erc20'],
    extensions: {
      originTokenAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7',
      originTokenNetwork: 0,
      wrappedTokenNetwork: 1,
    },
  },
  {
    chainId: 1101,
    name: 'USD Coin',
    symbol: 'USDC.e',
    decimals: 6,
    address: '0x37eAA0eF3549a5Bb7D431be78a3D99BD360d19e5',
    logoURI: 'https://assets.polygon.technology/tokenAssets/usdc.svg',
    tags: ['lxly', 'stablecoin', 'erc20', 'customZkevmBridge'],
    extensions: {
      originTokenAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      originChainBridgeAdapter: '0x70E70e58ed7B1Cec0D8ef7464072ED8A52d755eB',
      wrapperChainBridgeAdapter: '0xBDa0B27f93B2FD3f076725b89cf02e48609bC189',
      originTokenNetwork: 0,
      wrappedTokenNetwork: 1,
    },
  },
  {
    chainId: 1101,
    name: 'Dai',
    symbol: 'DAI',
    decimals: 18,
    address: '0x744C5860ba161b5316F7E80D9Ec415e2727e5bD5',
    logoURI: 'https://assets.polygon.technology/tokenAssets/dai.svg',
    tags: ['lxly', 'stablecoin', 'erc20', 'customZkevmBridge'],
    extensions: {
      originTokenAddress: '0x6b175474e89094c44da98b954eedeac495271d0f',
      originChainBridgeAdapter: '0x4A27aC91c5cD3768F140ECabDe3FC2B2d92eDb98',
      wrapperChainBridgeAdapter: '0x744C5860ba161b5316F7E80D9Ec415e2727e5bD5',
      originTokenNetwork: 0,
      wrappedTokenNetwork: 1,
    },
  },
];

// Demo Data
const demoTokenList = [
  {
    name: 'Polygon',
    symbol: 'MATIC',
    logoFile: 'matic.svg',
    amount: 0.01553408,
    amountConverted: 49.15,
  },
  {
    name: 'Tether USD',
    symbol: 'USDT',
    logoFile: 'usdt.svg',
    amount: 110.15,
    amountConverted: 110.15,
  },
];

type TokenItemData = {
  name: string;
  symbol: string;
  logoFile: string;
  amount: number;
  amountConverted: number;
};

function TokenItem({
  name,
  symbol,
  logoFile,
  amount,
  amountConverted,
}: TokenItemData) {
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
          <div className="font-extrabold">{amount}</div>
          <div className="text-slate-500 text-sm">{amountConverted} USDT</div>
        </div>
      </div>
    </>
  );
}

export default function TokenList() {
  return (
    <>
      <div className="flex flex-col space-y-6 mt-4">
        {demoTokenList.map((token) => (
          <TokenItem
            key={token.name}
            name={token.name}
            symbol={token.symbol}
            logoFile={token.logoFile}
            amount={token.amount}
            amountConverted={token.amountConverted}
          />
        ))}
      </div>
    </>
  );
}
