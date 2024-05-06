'use server';

import { type Rate } from '@/context/RatesContext';

export async function fetchRates(): Promise<Rate[]> {
  // Mock data for testing purposes
  // Using a USD base for simplicity

  // Get a random value for ETH
  const randomEthValue = Math.random() * 100000000000;

  const mockRates: Rate[] = [
    { code: 'MATIC', rate: 0.45 },
    { code: 'ETH', rate: randomEthValue },
    { code: 'BRL', rate: 5.17 },
  ];

  return mockRates;
}
