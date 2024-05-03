// app/actions.ts

'use server';

import { type Rate } from '@/context/RatesContext';

export async function fetchRates(): Promise<Rate[]> {
  // Mock data for testing purposes
  // Using a USD base for simplicity
  const mockRates: Rate[] = [
    { code: 'MATIC', rate: 0.45 },
    { code: 'BRL', rate: 5.17 },
  ];

  return mockRates;
}
