import { BRL } from '@/lib/currency';

interface BRLProps {
  amount: number | string;
}

const AmountBRL = ({ amount }: BRLProps) => {
  return <>{BRL(amount).format()}</>;
};

export default AmountBRL;
