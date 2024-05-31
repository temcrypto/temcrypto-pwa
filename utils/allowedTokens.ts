export type AllowedToken = (typeof allowedTokensList)[0]; // TODO: Improve this

// This is a subset of https://api-polygon-tokens.polygon.technology/tokenlists/polygonPopular.tokenlist.json
// TODO: Improve this to get from the API or cache
const allowedTokensList = [
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
  // {
  //   chainId: 137,
  //   name: 'Dai',
  //   symbol: 'DAI',
  //   decimals: 18,
  //   address: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063',
  //   logoURI: 'https://assets.polygon.technology/tokenAssets/dai.svg',
  //   tags: ['pos', 'stablecoin', 'erc20', 'swapable', 'metaTx'],
  //   extensions: {
  //     originTokenAddress: '0x6b175474e89094c44da98b954eedeac495271d0f',
  //     originTokenNetwork: 0,
  //   },
  // },
  // {
  //   chainId: 137,
  //   name: 'Aave',
  //   symbol: 'AAVE',
  //   decimals: 18,
  //   address: '0xd6df932a45c0f255f85145f286ea0b292b21c90b',
  //   logoURI: 'https://assets.polygon.technology/tokenAssets/aave.svg',
  //   tags: ['pos', 'erc20', 'swapable', 'metaTx'],
  //   extensions: {
  //     originTokenAddress: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
  //     originTokenNetwork: 0,
  //   },
  // },
  // {
  //   chainId: 137,
  //   name: 'ChainLink Token',
  //   symbol: 'LINK',
  //   decimals: 18,
  //   address: '0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39',
  //   logoURI: 'https://assets.polygon.technology/tokenAssets/link.svg',
  //   tags: ['pos', 'erc20', 'swapable', 'metaTx'],
  //   extensions: {
  //     originTokenAddress: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
  //     originTokenNetwork: 0,
  //   },
  // },
];

export default allowedTokensList;
