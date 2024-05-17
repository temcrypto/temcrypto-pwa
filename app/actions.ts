'use server';

import { type Rate } from '@/context/RatesContext';
import allowedTokensList from '@/utils/allowedTokens';

// Function to fetch rates (in USDT) from the rates API
export async function fetchRates(): Promise<Rate[]> {
  try {
    // Fetch rates from the BitPay API
    const response = await fetch('https://api.temcrypto.com/v1/rates/USDT', {
      next: { revalidate: 60 }, // Revalidate the cache every 60 seconds
    });

    // Check if the response is ok
    if (!response.ok) {
      throw new Error('Failed to fetch rates');
    }

    // Parse the response JSON data
    const { rates }: { rates: Rate[] } = await response.json();

    // Create a lookup object for faster access
    const ratesLookup = new Map(rates.map((rate) => [rate.code, rate]));

    const ratesArray = allowedTokensList.map(({ symbol }): Rate => {
      const rateData = ratesLookup.get(symbol);
      if (!rateData) {
        console.warn(`No rate found for ${symbol}`); // Log a warning instead of an error
      }
      return {
        code: symbol,
        name: rateData?.name ?? '', // Get the token name from the API response
        rate: rateData?.rate ? 1 / rateData.rate : 0, // Calculate the token rate value
      };
    });

    return ratesArray;
  } catch (error) {
    console.error('Error fetching rates:', error);
    // Handle the error or return a default value
    return [];
  }
}
