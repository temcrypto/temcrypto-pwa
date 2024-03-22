'use client';

import React, {
  type ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { useSendPixContext } from '@/context/SendPixContext';

// import AmountInput from './AmountInput';
import PixKeyInput from './PixKeyInput';

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
const amountRegex =
  /^(?:[5-9]|[1-9]\d|[1-4]\d{2})(?:[.,]\d{1,2})?$|^(500)(?:[.,]0{1,2})?$/;

interface SendPixFormProps {
  onSubmit: (data: any) => void; // TODO: Consider defining a more specific type for the data.
}

const SendPixForm = ({ onSubmit }: SendPixFormProps) => {
  const [amountInputReadOnly, setAmountInputReadOnly] = useState(true);
  const [canSubmit, setCanSubmit] = useState(false);
  const [formattedAmount, setFormattedAmount] = useState('');
  const { sendPixState, setSendPixState } = useSendPixContext();
  const amountInputRef = useRef<HTMLInputElement>(null);

  // Update PixKey in context when the input changes
  const handlePixKeyChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const textTrim = e.target.value.trim();
      console.log(
        '🚀 ~ SendPixForm ~ handlePixKeyChange - textTrim:',
        textTrim
      );
      // if (textTrim !== sendPixState.pixKey) {
      setAmountInputReadOnly(textTrim === ''); // Set amountInputReadOnly based on the presence of textTrim
      setSendPixState((prevState) => ({ ...prevState, pixKey: textTrim }));
      // }
    },
    [setSendPixState]
  );

  // Update the input focus when a valid pixKey is pasted successfully
  // const handlePasteSuccess = useCallback(() => {
  //   console.log(
  //     '🚀 ~ handlePasteSuccess ~ handlePasteSuccess:',
  //     amountInputRef.current,
  //     sendPixState.loading,
  //     `--${sendPixState.pixKey}--`
  //   );
  //   setAmountInputReadOnly(false); // Update the readOnly state first
  //   setTimeout(() => {
  //     amountInputRef.current?.focus();
  //     console.log(
  //       '🚀 ~ setTimeout ~ amountInputRef.current:',
  //       amountInputRef.current
  //     );
  //   }, 150);
  // }, [sendPixState.pixKey, sendPixState.loading]);

  // Validate and update amount
  const handleAmountChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      const isValid = amountRegex.test(inputValue);
      const amountWithPeriod = inputValue.replace(',', '.');
      const amountSafe = parseFloat(amountWithPeriod);

      setFormattedAmount(inputValue); // Update the formatted amount state to show in the UI
      console.log(
        '🚀 ~ SendPixForm ~ setFormattedAmount:',
        inputValue,
        amountSafe
      );
      setSendPixState((prevState) => ({
        ...prevState,
        amountBrl: isNaN(amountSafe) ? 0 : amountSafe,
      }));
      setCanSubmit(isValid);
    },
    [setSendPixState]
  );

  const handlePasteSuccess = useCallback(() => {
    console.log('🚀 ~ handlePasteSuccess ~ handlePasteSuccess:');
    setAmountInputReadOnly(false);
    setTimeout(() => {
      amountInputRef.current?.focus();
    }, 150);
  }, []);

  useEffect(() => {
    if (!sendPixState.amountBrl) {
      setFormattedAmount('');
    }
  }, [sendPixState.amountBrl]);

  return (
    <form onSubmit={onSubmit} className="mt-20">
      <PixKeyInput
        id="pixKey"
        name="pixKey"
        aria-label="Enter Chave Pix such as CPF, CNPJ, phone number, or email"
        placeholder="CPF, phone number, email..."
        value={sendPixState.pixKeyParsed || sendPixState.pixKey}
        onChange={handlePixKeyChange}
        required={true}
        disabled={sendPixState.loading}
        onPasteSuccess={handlePasteSuccess}
      />

      <div className="relative mt-8 rounded-2xl shadow-sm text-xl">
        <input
          type="text"
          inputMode="decimal"
          ref={amountInputRef}
          className="transition ease-in-out block w-full rounded-2xl border-0 py-4 pl-12 pr-4 text-slate-800 placeholder:text-slate-400 ring ring-slate-200 focus:ring-pink-500 focus:outline-none appearance-none read-only:ring-slate-300 read-only:focus:ring-slate-300 read-only:bg-slate-300 read-only:text-slate-400 invalid:focus:ring-red-500 invalid:focus:text-red-500 invalid:focus:bg-red-100 peer"
          id="amount"
          name="amount"
          aria-label="Enter the transaction amount between 5,00 and 500,00"
          placeholder="5,00 - 500,00"
          value={formattedAmount}
          readOnly={
            amountInputReadOnly ||
            sendPixState.pixKey === '' ||
            sendPixState.loading
          }
          disabled={sendPixState.loading}
          pattern={amountRegex.source}
          required={true}
          onChange={handleAmountChange}
        />
        <div
          className={
            'transition ease-in-out pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-800  peer-invalid:text-slate-400 peer-invalid:peer-focus:text-red-500 peer-read-only:text-slate-400'
          }
        >
          R$
        </div>
      </div>

      <button
        type="submit"
        className={`transition ease-in-out w-full rounded-2xl p-4 mt-8 text-center text-xl text-white bg-pink-500 ring ring-pink-500 active:bg-pink-700 active:ring-pink-700 hover:bg-pink-600 hover:ring-pink-600 disabled:text-slate-400 disabled:bg-slate-300 disabled:ring-slate-300 cursor-pointer disabled:cursor-not-allowed ${
          sendPixState.loading ? 'animate-pulse' : ''
        }`}
        disabled={!canSubmit || sendPixState.loading}
      >
        {sendPixState.loading ? 'Loading...' : 'Continue'}
      </button>
    </form>
  );
};

export default SendPixForm;
