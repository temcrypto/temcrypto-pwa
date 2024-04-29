// Code assisted by Claude 3 Sonnet, an AI assistant created by Anthropic

import { importSPKI, jwtVerify, type JWTPayload, type KeyLike } from 'jose';

/**
 * Fetches the public key from the specified URL and imports it as a KeyLike object
 * using the 'RS256' algorithm.
 *
 * @returns A Promise that resolves with the imported KeyLike object.
 * @throws An error if the public key could not be fetched or imported.
 */
const getKey = async (): Promise<KeyLike> => {
  try {
    const response = await fetch(
      `https://app.dynamicauth.com/api/v0/environments/${process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID}/keys`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.NEXT_DYNAMIC_BEARER_TOKEN}`,
        },
      }
    );

    // Fetch and parse the response JSON
    const json = await response.json();

    // Get the public key from the response
    const publicKey = json.key.publicKey;

    // Convert the Base64-encoded public key to an ASCII string
    const pemPublicKey = Buffer.from(publicKey, 'base64').toString('ascii');

    // Import the public key as a KeyLike object using the 'RS256' algorithm
    const keyLike = await importSPKI(pemPublicKey, 'RS256');

    return keyLike;
  } catch (err) {
    console.error('Error fetching public key', err);
    throw err;
  }
};

/**
 * Validates the provided JWT token using the fetched public key.
 *
 * @param token - The JWT token to be validated.
 * @returns A Promise that resolves with the decoded JWT payload if the token is valid,
 * or null if the token is invalid.
 */
export const validateJWT = async (
  token: string
): Promise<JWTPayload | null> => {
  try {
    // Get the public key
    const publicKey = await getKey();

    // Verify the JWT token using the public key
    const { payload } = await jwtVerify(token, publicKey);

    // Return the decoded payload
    return payload as JWTPayload;
  } catch (err) {
    console.error('Invalid token:', err);
    return null;
  }
};
