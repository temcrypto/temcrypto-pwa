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

    // Map the rates to the desired format and include only allowed tokens
    const ratesArray = allowedTokensList.map(({ symbol }) => {
      const rateObj = rates.find((rate) => rate.code === symbol);
      if (rateObj) {
        const value = 1 / rateObj.rate; // Calculate the rate value
        return { code: symbol, rate: value }; // Return the token and rate
      } else {
        console.warn(`No rate found for ${symbol}`); // Log a warning instead of an error
        return { code: symbol, rate: 0 }; // Return a rate with value 0 for missing tokens
      }
    });

    return ratesArray;
  } catch (error) {
    console.error('Error fetching rates:', error);
    // Handle the error or return a default value
    return [];
  }
}
