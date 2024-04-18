const MAX_RETRY = 3;
const RETRY_BACKOFF = 300;

/**
 * Refreshes the authentication token.
 * This function should contain the logic to refresh the auth token and return a new token.
 * Returns a new token if successful, or null if the refresh fails.
 * @returns {Promise<string | null>} The new token or null.
 */
async function refreshAuthToken(): Promise<string | null> {
  // This is a placeholder. Replace with actual logic to refresh the token.
  return 'newToken'; // Example, replace with real logic.
}

/**
 * Performs an HTTP request with retry logic for failures.
 * Attempts to fetch a resource from the provided URL. If the request fails due to
 * authentication error (401), it tries to refresh the token and retry the request.
 * For server errors (status >= 500), it retries the request based on the retry policy.
 *
 * @param {string} url The URL to fetch.
 * @param {RequestInit} options The options for the fetch request.
 * @param {number} retries The number of retries left (defaults to MAX_RETRY).
 * @param {number} backoff The backoff delay before retrying (defaults to RETRY_BACKOFF).
 * @returns {Promise<Response>} The fetch response.
 * @throws {Error} Throws an error if the request ultimately fails or if token refresh fails.
 */
async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries: number = MAX_RETRY,
  backoff: number = RETRY_BACKOFF
): Promise<Response> {
  try {
    const response = await fetch(url, options);
    if (response.status === 401) {
      console.log(
        `KP: Authentication error. Attempting to refresh auth token.`
      );
      const newToken = await refreshAuthToken();

      if (newToken) {
        // Clone options to avoid undesired mutations.
        const updatedOptions = {
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${newToken}`, // Assumes Bearer token usage.
          },
        };
        // Retry the request with the updated options.
        return fetch(url, updatedOptions);
      } else {
        throw new Error('Unable to refresh auth token');
      }
    } else if (!response.ok && retries > 0 && response.status >= 500) {
      console.log(`KP: Retrying request to ${url}. Attempts left: ${retries}`);
      await new Promise((resolve) => setTimeout(resolve, backoff));
      return fetchWithRetry(url, options, retries - 1, backoff * 2);
    }
    return response;
  } catch (error) {
    if (retries > 0) {
      console.log(`KP: Retrying request to ${url}. Attempts left: ${retries}`);
      await new Promise((resolve) => setTimeout(resolve, backoff));
      return fetchWithRetry(url, options, retries - 1, backoff * 2);
    }
    throw error;
  }
}

/**
 * Performs a GET request using the fetchWithRetry function.
 *
 * @param {string} url The URL to perform the GET request.
 * @param {HeadersInit} headers Additional headers for the request.
 * @returns {Promise<any>} The JSON response body.
 * @throws {Error} Throws an error if handling the response fails.
 */
async function get(url: string, headers: HeadersInit = {}): Promise<any> {
  try {
    const response = await fetchWithRetry(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    });
    return await handleResponse(response);
  } catch (error) {
    handleError(error);
  }
}

/**
 * Performs a POST request using the fetchWithRetry function.
 *
 * @param {string} url The URL to perform the POST request.
 * @param {T} body The body of the request to be stringified.
 * @param {HeadersInit} headers Additional headers for the request.
 * @returns {Promise<any>} The JSON response body.
 * @throws {Error} Throws an error if handling the response fails.
 */
async function post<T>(
  url: string,
  body: T,
  headers: HeadersInit = {}
): Promise<any> {
  try {
    const response = await fetchWithRetry(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify(body),
    });
    return await handleResponse(response);
  } catch (error) {
    handleError(error);
  }
}

/**
 * Handles the HTTP response, parsing the JSON content.
 *
 * @param {Response} response The response object from the fetch request.
 * @returns {Promise<any>} The parsed JSON response body.
 * @throws {Error} Throws an error if the response is not OK.
 */
async function handleResponse(response: Response): Promise<any> {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }
  return response.json(); // Assumes the response is JSON.
}

/**
 * Handles errors occurred during the fetch request or response handling.
 *
 * @param {unknown} error The caught error object.
 * @throws {Error} Rethrows the error after logging.
 */
function handleError(error: unknown): void {
  if (error instanceof Error) {
    console.error('KP: HTTP Client Error:', error.message);
    throw error;
  } else {
    console.error('KP: An unexpected error occurred:', error);
    throw new Error('An unexpected error occurred');
  }
}

export const httpClient = {
  get,
  post,
};
