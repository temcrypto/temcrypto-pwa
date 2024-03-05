import currency from 'currency.js';

export const USDT = (value: any) =>
  currency(value, { symbol: 'USDT', precision: 2, pattern: `# !` });

export const BRL = (value: any) =>
  currency(value, { symbol: 'R$ ', precision: 2, decimal: ',', separator: '.' });
