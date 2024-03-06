import currency from 'currency.js';

interface BRLProps {
  amount: number;
}

const AmountBRL = ({ amount }: BRLProps) => {
  const amountStr = currency(amount).format({
    symbol: 'R$ ',
    precision: 2,
    decimal: ',',
    separator: '.',
  });
  console.log('🚀 ~ amountStr ~ amountStr:', amountStr, amount);

  return <>{amountStr}</>;
};

export default AmountBRL;
