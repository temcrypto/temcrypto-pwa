type kpResponseCode = 200 | 400 | 401 | 500;

// Rates
export type kpRatePair =
  | 'BRLUSDT'
  | 'USDTBRL'
  | 'ARSBRL'
  | 'BRLARS'
  | 'USDTARS';

export type kpRateType = 'charge' | 'pay';

export type kpRateResponse = {
  status_code: kpResponseCode;
  msg: string;
  data: {
    total_brl: number;
    total_usdt: number;
    rate: number;
    timeout: number;
  };
};
