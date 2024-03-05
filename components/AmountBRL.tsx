import { BRL, type CurrencyValue } from '@/lib/currency';

interface BRLProps {
  amount: CurrencyValue;
}

const AmountBRL = ({ amount }: BRLProps) => {
  return <>{BRL(amount).format()}</>;
};

export default AmountBRL;
