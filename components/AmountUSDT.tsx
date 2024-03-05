import { type CurrencyValue, USDT } from '@/lib/currency';

interface USDTProps {
  amount: CurrencyValue;
}

const AmountUSDT = ({ amount }: USDTProps) => {
  return <>{USDT(amount).format()}</>;
};

export default AmountUSDT;
