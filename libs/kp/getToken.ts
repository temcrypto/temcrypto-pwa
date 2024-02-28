import { KP_BASE_URL_V2 } from './constants';

let kpToken: string = '';

async function getToken() {
  if (kpToken !== '') {
    console.log('🚀 ~ getToken ~ current kpToken:', kpToken);
    return kpToken;
  }

  console.log('🚀 ~ getToken ~');

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
      const error = new Error('Request failed') as any; // TODO: improve type
      error.status = response.status;
      error.statusText = response.statusText;
      throw error;
    }

    const data = await response.json();
    kpToken = data.token as string;
    console.log('🚀 ~ getToken ~ new kpToken:', kpToken);
    return kpToken;
  } catch (error: any) {
    console.log('🚀 ~ getToken ~ error:', error, error.status);
    const err = new Error(error.statusText) as any; // TODO: improve type
    err.status = error.status || 500;
    throw err;
  }
}

export default getToken;
