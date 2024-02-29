// import { KP_BASE_URL_V1 } from './constants';
// import getToken from './getToken';
// import { httpClient } from './httpClient';
import { type kpPixValidationResponse } from './types';

/**
 * Validates a Pix key by making an HTTP request to a specified endpoint.
 *
 * This function validates the provided Pix key against the external API. It first sanitizes
 * and validates the input, then uses the httpClient to send the request. It handles both
 * successful responses and errors, returning a structured object with either the data
 * or an error message.
 *
 * @param {string} pixKey The Pix key to be validated.
 * @returns {Promise<kpPixValidationResponse>} An object containing either the validation data or throw an error if fails.
 */
async function validatePixKey(
  pixKey: string
): Promise<kpPixValidationResponse> {
  console.log('🚀 ~ validatePixKey ~ pixKey:', pixKey);

  try {
    // TODO: Validate and sanitize pixKey
    // Example: You could use a regular expression to ensure the pixKey format is correct
    // and escape any special characters as necessary.

    // const url = `${KP_BASE_URL_V1}/v1/payments/pixKeyValidation?pixKey=${encodeURIComponent(
    //   pixKey
    // )}`;

    // const accessToken = await getToken(); // Dynamically retrieves the access token

    // // Use the httpClient for the GET request, passing in the URL and authorization headers
    // const response: kpPixValidationResponse = await httpClient.get(url, {
    //   Authorization: `Bearer ${accessToken}`,
    // });

    // TODO: clean mock response
    const response: kpPixValidationResponse = {
      msg: 'valid pixkey',
      name: 'Cripto Fulanita',
      reformated_key: 'cripto.fulanita@temcrypto.com',
    };

    // Since httpClient handles request errors, assume a successful response if no exceptions are thrown.
    return response;
  } catch (err) {
    console.error('🚀 ~ validatePixKey ~ err:', err);

    // Enhance error handling by creating a more descriptive error
    // and maintaining correct type checking.
    let errorMessage = 'Error validating Pix Key';
    if (err instanceof Error) {
      errorMessage += `: ${err.message}`;
    }
    throw new Error(errorMessage);
  }
}

export default validatePixKey;
