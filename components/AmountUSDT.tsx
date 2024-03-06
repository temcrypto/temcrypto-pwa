import currency from 'currency.js';

interface USDTProps {
  amount: number;
}

const AmountUSDT = ({ amount }: USDTProps) => {
  return (
    <>
      {currency(amount).format({
        symbol: 'USDT',
        precision: 2,
        pattern: `# !`,
        decimal: '.',
        separator: ',',
      })}
    </>
  );
};

export default AmountUSDT;
