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
];

// Demo Data
const demoTokenList = [
  {
    name: 'Polygon',
    symbol: 'MATIC',
    logoURI: 'https://assets.polygon.technology/tokenAssets/matic.svg',
    amount: 0.01553408,
    amountConverted: 49.15,
  },
  {
    name: 'Tether USD',
    symbol: 'USDT',
    logoURI: 'https://assets.polygon.technology/tokenAssets/usdt.svg',
    amount: 110.15,
    amountConverted: 110.15,
  },
];

type TokenItemData = {
  name: string;
  symbol: string;
  logoURI: string;
  amount: number;
  amountConverted: number;
};

function TokenItem({
  name,
  symbol,
  logoURI,
  amount,
  amountConverted,
}: TokenItemData) {
  return (
    <>
      <div className="token-item flex flex-row justify-between items-center">
        <div className="token-item-data">
          <div className="flex flex-row">
            <Image
              src={logoURI}
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
            logoURI={token.logoURI}
            amount={token.amount}
            amountConverted={token.amountConverted}
          />
        ))}
      </div>
    </>
  );
}
