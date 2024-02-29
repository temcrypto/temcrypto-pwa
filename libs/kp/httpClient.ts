const MAX_RETRY = 3;
const RETRY_BACKOFF = 300;

async function refreshAuthToken(): Promise<string | null> {
  // Aquí iría la lógica para refrescar el token.
  // Retorna el nuevo token o null si falla.
  return 'newToken'; // Ejemplo, reemplazar con la lógica real.
}

// Función para realizar una solicitud con reintentos
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
        // Clonar options para evitar mutaciones no deseadas
        const updatedOptions = {
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${newToken}`, // Asume que usas tokens tipo Bearer
          },
        };
        return fetch(url, updatedOptions); // Intenta la solicitud nuevamente con el nuevo token. Usa las opciones actualizadas
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

async function get(url: string, headers: HeadersInit = {}) {
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

async function post<T>(url: string, body: T, headers: HeadersInit = {}) {
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

async function handleResponse(response: Response) {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }
  return response.json(); // Asume que la respuesta es JSON
}

function handleError(error: unknown) {
  // Verifica si el error es una instancia de Error
  if (error instanceof Error) {
    console.error('KP: HTTP Client Error:', error.message);
    throw error;
  } else {
    // Si no es un Error, maneja el caso o lanza un nuevo Error
    console.error('KP: An unexpected error occurred:', error);
    throw new Error('An unexpected error occurred');
  }
}

export const httpClient = {
  get,
  post,
};
