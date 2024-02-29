import { KP_BASE_URL_V2 } from './constants';
import { kpGetTokenResponse } from './types';

let kpToken: string = '';
let tokenExpiration: Date = new Date();
const TOKEN_EXPIRATION = 120; // Expiration in seconds (2m)

/**
 * Fetches and caches an authentication token. If a cached token is still valid,
 * it returns the cached token. Otherwise, it fetches a new token from the API.
 *
 * Validates the token's expiration before returning the cached token. If the token
 * has expired or does not exist, it makes a POST request to the API to fetch a new
 * token and updates the cache.
 *
 * @returns {Promise<string>} The fetched or cached token if successful, or throw an Error if failed.
 */
async function getToken(): Promise<string> {
  const now = new Date();
  if (kpToken !== '' && now < tokenExpiration) {
    console.log('🚀 ~ getToken ~ using cached kpToken');
    return kpToken;
  }

  console.log('🚀 ~ getToken ~ fetching new token');

  try {
    const url = `${KP_BASE_URL_V2}/auth/token`;

    const formData = new FormData();
    formData.append('username', process.env.KP_AUTH_USER as string);
    formData.append('password', process.env.KP_AUTH_PASS as string);

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (response.status !== 200) {
      throw new Error(
        `Request failed with status ${response.status}: ${response.statusText}`
      );
    }

    const data: kpGetTokenResponse = await response.json();
    kpToken = data.access_token;
    tokenExpiration = new Date(now.getTime() + TOKEN_EXPIRATION * 1000);

    console.log('🚀 ~ getToken ~ new kpToken obtained');
    return kpToken;
  } catch (err: any) {
    console.error('KP: Error getting token:', err.message);
    throw new Error('Error getting token');
  }
}

export default getToken;
