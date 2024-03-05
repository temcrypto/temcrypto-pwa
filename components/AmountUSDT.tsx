import { USDT } from '@/lib/currency';

interface USDTProps {
  amount: number | string;
}

const AmountUSDT = ({ amount }: USDTProps) => {
  return <>{USDT(amount).format()}</>;
};

export default AmountUSDT;
