import currency from 'currency.js';

export type CurrencyValue = number | string;

const getCurrencyOpt = (amount: CurrencyValue) => {
  const amountSafe = typeof amount === 'number' ? amount.toFixed(2) : amount;
  console.log("🚀 ~ getCurrencyOpt ~ amountSafe:", amount, amountSafe)
  const decimal = amountSafe.includes(',') ? ',' : '.';
  return { decimal };
};

export const USDT = (value: CurrencyValue) => {
  const currencyOpt = getCurrencyOpt(value);
  return currency(value, {
    symbol: 'USDT',
    precision: 2,
    pattern: `# !`,
    decimal: currencyOpt.decimal,
    separator: ',',
  });
};

export const BRL = (value: CurrencyValue) => {
  const currencyOpt = getCurrencyOpt(value);
  console.log('🚀 ~ BRL ~ currencyOpt:', value, currencyOpt);
  return currency(value, {
    symbol: 'R$ ',
    precision: 2,
    decimal: currencyOpt.decimal,
    // separator: '.',
  });
};
