import jwt, {
  type JwtPayload,
  type Secret,
  type VerifyErrors,
} from 'jsonwebtoken';

export const getKey = (
  _headers: any, // TODO: Check typings
  callback: (err: Error | null, key?: Secret) => void
): void => {
  // Define the options for the fetch request
  const options = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${process.env.NEXT_DYNAMIC_BEARER_TOKEN}`,
    },
  };

  // Perform the fetch request asynchronously
  fetch(
    `https://app.dynamicauth.com/api/v0/environments/${process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID}/keys`,
    options
  )
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      const publicKey = json.key.publicKey;
      const pemPublicKey = Buffer.from(publicKey, 'base64').toString('ascii');
      console.log('getKey ~ pemPublicKey', pemPublicKey);
      callback(null, pemPublicKey); // Pass the public key to the callback
    })
    .catch((err) => {
      console.error(err);
      callback(err); // Pass the error to the callback
    });
};

export const validateJWT = (token: string): Promise<JwtPayload | null> => {
  return new Promise((resolve) => {
    jwt.verify(
      token,
      getKey,
      { algorithms: ['RS256'] },
      (err: VerifyErrors | null, decoded: JwtPayload | string | undefined) => {
        if (err) {
          console.error('Invalid token:', err);
          resolve(null); // Rejecting or resolving with null to handle errors gracefully
        }

        // Ensuring that the decoded token is of type JwtPayload
        if (typeof decoded === 'object' && decoded !== null) {
          resolve(decoded as JwtPayload);
        } else {
          console.error('Invalid token: Decoded payload is not an object');
          resolve(null);
        }
      }
    );
  });
};
