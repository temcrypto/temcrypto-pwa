// API
type kpResponseCode = 200 | 400 | 401 | 500;

// Webhooks Payment Statuses
export type kpPaymentStatus =
  | 'mined'
  | 'dropped'
  | 'processing'
  | 'done'
  | 'failed';

// Auth
export type kpGetTokenResponse = {
  access_token: string;
  token_type: string;
};

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

// Pix Validation
export type kpPixValidationResponse = {
  msg: string;
  name: string;
  reformated_key: string;
};
