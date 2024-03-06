import currency from 'currency.js';

interface BRLProps {
  amount: number;
}

const AmountBRL = ({ amount }: BRLProps) => {
  return (
    <>
      {currency(amount).format({
        symbol: 'R$ ',
        precision: 2,
        pattern: `! #`,
        decimal: ',',
        separator: '.',
      })}
    </>
  );
};

export default AmountBRL;
