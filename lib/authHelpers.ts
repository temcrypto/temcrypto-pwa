import { importSPKI, jwtVerify, type JWTPayload, type KeyLike } from 'jose';

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
    const json = await response.json();
    const publicKey = json.key.publicKey;
    const pemPublicKey = Buffer.from(publicKey, 'base64').toString('ascii');
    const keyLike = await importSPKI(pemPublicKey, 'RS256');
    return keyLike;
  } catch (err) {
    console.error('Error fetching public key', err);
    throw err;
  }
};

export const validateJWT = async (
  token: string
): Promise<JWTPayload | null> => {
  try {
    const publicKey = await getKey();
    const { payload } = await jwtVerify(token, publicKey);
    return payload as JWTPayload;
  } catch (err) {
    console.error('Invalid token:', err);
    return null;
  }
};
