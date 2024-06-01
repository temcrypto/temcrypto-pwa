import { mainnet, polygon, polygonAmoy, polygonMumbai } from 'wagmi/chains';
import { createConfig, http } from '@wagmi/core';

export { WagmiProvider, useAccount } from 'wagmi';
export {
  estimateGas,
  getEnsAddress,
  getEnsAvatar,
  getEnsName,
  multicall,
} from '@wagmi/core';

// Wagmi Provider configuration
export const wagmiConfig = createConfig({
  chains: [polygon, polygonAmoy, polygonMumbai],
  multiInjectedProviderDiscovery: false,
  transports: {
    [polygon.id]: http(),
    [polygonAmoy.id]: http(),
    [polygonMumbai.id]: http(),
  },
});

// Wagmi Config for Mainnet
export const wagmiConfigMainnet = createConfig({
  chains: [mainnet],
  multiInjectedProviderDiscovery: false,
  transports: { [mainnet.id]: http() },
});
