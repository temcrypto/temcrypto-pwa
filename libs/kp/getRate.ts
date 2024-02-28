// import { KP_BASE_URL_V2 } from './constants';

import { type kpRatePair, type kpRateResponse, type kpRateType } from './types';

// const access_token = 'test'; // TODO: get from another function

async function getRate(pair: kpRatePair, type: kpRateType, amount: number) {
  try {
    // const url = `${KP_BASE_URL_V2}/v2/oracle?pair=${pair}&type=${type}&amount=${amount}`;

    // const response = await fetch(url, {
    //   method: 'GET',
    //   headers: {
    //     Authorization: `Bearer ${access_token}`,
    //     'Content-Type': 'application/json',
    //   },
    // });

    // if (response.status !== 200) {
    //   const error = new Error('Request failed') as any; // TODO: improve type
    //   error.status = response.status;
    //   error.statusText = response.statusText;
    //   throw error;
    // }

    // const data = await response.json();

    // TODO: clean mock response
    const data: kpRateResponse = {
      status_code: 200,
      msg: 'Request ok',
      data: {
        total_brl: 100.0,
        total_usdt: 19.37735,
        rate: 0.193773,
        timeout: 178,
      },
    };

    return data;
  } catch (error: any) {
    const err = new Error(error.statusText) as any; // TODO: improve type
    err.status = error.status || 500;
    throw err;
  }
}

export default getRate;
