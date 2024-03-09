'use client';

import React, {
  type ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { useSendPixContext } from '@/context/SendPixContext';

import AmountInput from './AmountInput';
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
  const [canSubmit, setCanSubmit] = useState(false);
  const [formattedAmount, setFormattedAmount] = useState('');
  const { sendPixState, setSendPixState } = useSendPixContext();
  const amountInputRef = useRef<HTMLInputElement>(null);

  // Update PixKey in context
  const handlePixKeyChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const textTrim = e.target.value.trim();
      console.log(
        '🚀 ~ SendPixForm ~ handlePixKeyChange - textTrim:',
        textTrim
      );
      if (textTrim !== sendPixState.pixKey) {
        setSendPixState((prevState) => ({ ...prevState, pixKey: textTrim }));
      }
    },
    [sendPixState.pixKey, setSendPixState]
  );

  // Validate and update amount
  const handleAmountChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      const isValid = amountRegex.test(inputValue);
      const amountWithPeriod = inputValue.replace(',', '.');
      const amountSafe = parseFloat(amountWithPeriod);

      setFormattedAmount(inputValue);
      setSendPixState((prevState) => ({
        ...prevState,
        amountBrl: isNaN(amountSafe) ? 0 : amountSafe,
      }));
      setCanSubmit(isValid);
    },
    [setSendPixState]
  );
  // const handleAmountChange = useCallback(
  //   (e: ChangeEvent<HTMLInputElement>) => {
  //     const inputValue = e.target.value;
  //     const isValid = amountRegex.test(inputValue);
  //     const amountWithPeriod = inputValue.replace(',', '.');
  //     const amountSafe = parseFloat(amountWithPeriod);

  //     setFormattedAmount(inputValue); // Update the formatted amount state to show in the UI
  //     setSendPixState((prevState) => ({
  //       ...prevState,
  //       amountBrl: isNaN(amountSafe) ? 0 : amountSafe,
  //     }));
  //     setCanSubmit(isValid);
  //   },
  //   [setSendPixState]
  // );

  // const handlePixKeyPaste = useCallback(async () => {
  //   console.log('🚀 ~ handlePixKeyPaste ~ handlePixKeyPaste');
  //   // Ensure to prompt the user before accessing clipboard
  //   // const text = await navigator.clipboard.readText();
  //   // setSendPixState((prevState) => ({ ...prevState, pixKey: text.trim() }));
  //   setAmountAutoFocus(true);
  //   // }, [setSendPixState]);
  // }, []);

  const handlePasteSuccess = useCallback(() => {
    console.log(
      '🚀 ~ handlePasteSuccess ~ handlePasteSuccess:',
      amountInputRef.current
    );
    setTimeout(() => {
      amountInputRef.current?.focus();
    }, 0);
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
        onPasteSuccess={handlePasteSuccess}
        disabled={sendPixState.loading}
      />

      <AmountInput
        id="amount"
        name="amount"
        aria-label="Enter the transaction amount between 5,00 and 500,00"
        placeholder="5,00 - 500,00"
        value={formattedAmount}
        onChange={handleAmountChange}
        required={true}
        pattern={amountRegex.source}
        readOnly={sendPixState.pixKey === ''}
        disabled={sendPixState.loading}
        ref={amountInputRef}
        onFocus={() => console.log('AmountInput focused')}
      />

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
