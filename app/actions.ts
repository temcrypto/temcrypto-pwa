'use server';

import { type Rate } from '@/context/RatesContext';

export async function fetchRates(): Promise<Rate[]> {
  // Mock data for testing purposes
  // Using a USD base for simplicity

  // Get a random value for ETH between 2500 and 3800
  const randomEthValue = Math.floor(Math.random() * (3800 - 2500 + 1)) + 2500;

  const mockRates: Rate[] = [
    { code: 'MATIC', value: 0.45 },
    { code: 'ETH', value: randomEthValue },
    { code: 'USDT', value: 1 },
    { code: 'BRL', value: 5.17 },
  ];

  return mockRates;
}
