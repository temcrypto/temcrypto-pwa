// import { KP_BASE_URL_V2 } from './constants';
// import getToken from './getToken';
// import { httpClient } from './httpClient';
import { type kpRatePair, type kpRateResponse, type kpRateType } from './types';

/**
 * Fetches the exchange rate for a given currency pair, type, and amount.
 *
 * Validates and sanitizes the input parameters before making the HTTP GET request. Utilizes the httpClient
 * for streamlined error handling and token management. Returns the fetched rate data or an error if the
 * request fails or validation errors occur.
 *
 * @param {kpRatePair} pair The currency pair for which to get the rate.
 * @param {kpRateType} type The type of rate to fetch.
 * @param {number} amount The amount for which to calculate the rate.
 * @returns {Promise<kpRateResponse>} An object containing either the rate data or throw an error if fails.
 */
async function getRate(
  pair: kpRatePair,
  type: kpRateType,
  amount: number
): Promise<kpRateResponse> {
  try {
    // TODO: Validate and sanitize inputs
    // Example: Ensure pair and type match expected formats and amount is a valid number

    // const accessToken = await getToken(); // Dynamically retrieves the access token

    // const queryParams = new URLSearchParams({
    //   pair,
    //   type,
    //   amount: amount.toString(),
    // }).toString();
    // const url = `${KP_BASE_URL_V2}/v2/oracle?${queryParams}`;

    // const response: kpRateResponse = await httpClient.get(url, {
    //   Authorization: `Bearer ${accessToken}`,
    // });

    // TODO: clean mock response
    const rateUsdtBrl = 4.63;
    const response: kpRateResponse = {
      status_code: 200,
      msg: 'Request ok',
      data: {
        total_brl: amount,
        // total_usdt: 19.37735,
        total_usdt: amount / rateUsdtBrl,
        rate: 1 / rateUsdtBrl,
        timeout: 178,
      },
    };

    // Assuming httpClient handles non-200 responses by throwing an error, so no need for status check here.
    return response;
  } catch (err) {
    let errorMessage = 'Error getting the pair rate';
    if (err instanceof Error) {
      errorMessage += `: ${err.message}`;
    }
    throw new Error(errorMessage);
  }
}

export default getRate;
