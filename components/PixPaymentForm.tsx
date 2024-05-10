'use client';

import React, {
  type ChangeEvent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { LuQrCode } from 'react-icons/lu';

import { usePixPaymentContext } from '@/context/PixPaymentContext';

// Regular Expression to Validate Currency Inputs from 5.00 up to 500.00

/*
Explanation:
- The regex is divided into two main parts by the OR operator (|), handling numbers less than 500 and exactly 500 differently.
- For numbers less than 500:
  - ^(?:[5-9]|[1-9]\d|[1-4]\d{2}): Matches numbers from 5 to 499, either as whole numbers or with decimal points.
  - (?:[.,]\d{1,2})?$: Optionally matches a decimal separator (period or comma) followed by one or two digits, allowing for values like "123.45".
- For the number 500:
  - ^(500)(?:[.,]0{1,2})?$: Specifically matches "500", with or without up to two trailing zeros after the decimal point, ensuring that values above 500.00, like "500.01", are not considered valid.
- This ensures precise validation of currency amounts from 5.00 to exactly 500.00, accommodating standard currency formats and correctly handling the upper limit.
*/
const AMOUNT_REGEX =
  /^(?:[5-9]|[1-9]\d|[1-4]\d{2})(?:[.,]\d{1,2})?$|^(500)(?:[.,]0{1,2})?$/;

interface PixPaymentFormProps {
  onScanQR: () => void;
  onSubmit: (data: any) => void; // TODO: Consider defining a more specific type for the data.
}

const PixPaymentForm = ({ onScanQR, onSubmit }: PixPaymentFormProps) => {
  const [amountInputReadOnly, setAmountInputReadOnly] = useState(true);
  const [canSubmit, setCanSubmit] = useState(false);
  const [formattedAmount, setFormattedAmount] = useState('');
  const { pixPaymentState, setPixPaymentState } = usePixPaymentContext();

  // Update PixKey in context when the input changes
  const handlePixKeyChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const textTrim = e.target.value.trim();
      setAmountInputReadOnly(textTrim === ''); // Set amountInputReadOnly based on the presence of textTrim
      setPixPaymentState((prevState) => ({ ...prevState, pixKey: textTrim }));
    },
    [setPixPaymentState]
  );

  // Validate and update amount
  const handleAmountChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      const isValid = AMOUNT_REGEX.test(inputValue);
      const amountWithPeriod = inputValue.replace(',', '.');
      const amountSafe = parseFloat(amountWithPeriod);

      setFormattedAmount(inputValue); // Update the formatted amount state to show in the UI
      setPixPaymentState((prevState) => ({
        ...prevState,
        amountBrl: isNaN(amountSafe) ? 0 : amountSafe,
      }));
      setCanSubmit(isValid);
    },
    [setPixPaymentState]
  );

  useEffect(() => {
    if (!pixPaymentState.amountBrl) {
      setFormattedAmount('');
    }
  }, [pixPaymentState.amountBrl]);

  return (
    <form onSubmit={onSubmit} className="mt-12">
      <div className="relative rounded-2xl text-xl">
        <input
          id="pixKey"
          name="pixKey"
          type="text"
          className="transition ease-in-out block w-full rounded-2xl border-2 border-slate-300 focus:border-pink-400 p-4 pr-24 text-slate-800 placeholder:text-slate-400 ring ring-slate-200 focus:ring-pink-300 focus:outline-none read-only:bg-slate-300 read-only:text-slate-400 read-only:ring-slate-200 appearance-none"
          aria-label="Enter Chave Pix such as CPF, CNPJ, phone number, or email"
          placeholder="CPF, phone number, email..."
          value={pixPaymentState.pixKeyParsed || pixPaymentState.pixKey}
          onChange={handlePixKeyChange}
          required={true}
          readOnly={pixPaymentState.loading}
        />
        <div className="absolute inset-y-0 right-0 pr-4 flex">
          <button
            type="button"
            className="text-pink-500 hover:text-pink-700 disabled:text-slate-400 text-base uppercase flex items-center"
            onClick={onScanQR}
            disabled={pixPaymentState.loading}
            aria-label="Scan QR button"
          >
            <span className="mr-1 text-lg">
              <LuQrCode />
            </span>
            Scan
          </button>
        </div>
      </div>

      <div className="relative rounded-2xl text-xl mt-8">
        <input
          type="text"
          inputMode="decimal"
          className="transition ease-in-out block w-full rounded-2xl border-2 border-slate-300 focus:border-pink-400 p-4 pl-12 text-slate-800 placeholder:text-slate-400 ring ring-slate-200 focus:ring-pink-300 focus:outline-none read-only:bg-slate-300 read-only:text-slate-400  read-only:ring-slate-200 invalid:ring-red-300 invalid:focus:ring-red-300 invalid:border-red-400 invalid:focus:border-red-400 invalid:focus:text-red-500 invalid:focus:bg-red-100 peer appearance-none"
          id="amount"
          name="amount"
          aria-label="Enter the transaction amount between 5,00 and 500,00"
          placeholder="5,00 - 500,00"
          value={formattedAmount}
          pattern={AMOUNT_REGEX.source}
          onChange={handleAmountChange}
          required={true}
          readOnly={
            amountInputReadOnly ||
            pixPaymentState.pixKey === '' ||
            pixPaymentState.loading
          }
        />
        <div
          className={
            'transition ease-in-out pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-800  peer-invalid:text-red-500 peer-read-only:text-slate-400'
          }
        >
          R$
        </div>
      </div>

      <button
        type="submit"
        className={`transition ease-in-out w-full rounded-2xl border-2 border-pink-500 focus:border-pink-500 p-4 mt-8 text-center text-xl text-white bg-pink-500 ring ring-pink-300 focus:ring-pink-300 active:bg-pink-700 active:ring-pink-400 active:border-pink-500 hover:bg-pink-600 hover:ring-pink-300 disabled:text-slate-400 disabled:bg-slate-300 disabled:border-slate-300 disabled:ring-slate-200 cursor-pointer disabled:cursor-not-allowed appearance-none ${
          pixPaymentState.loading ? 'animate-pulse' : ''
        }`}
        disabled={!canSubmit || pixPaymentState.loading}
      >
        {pixPaymentState.loading ? 'Loading...' : 'Continue'}
      </button>
    </form>
  );
};

export default PixPaymentForm;
